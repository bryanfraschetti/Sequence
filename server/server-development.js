// Confidential app credentials
require("dotenv").config();
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const cookieSigner = process.env.COOKIE_SIGNER;

// Frequent uris
const spotifyAuthUrl = "https://accounts.spotify.com/authorize";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";
const entryPoint = "http://127.0.0.1:3000/";
const authCallback = "http://127.0.0.1:3001/authorizationCallback";

// Modules
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

// Create redis client
const redis = require("redis");
const client = redis.createClient();
client
  .connect()
  .then(() => {
    console.log("Redis Client Connected");
  })
  .catch((err) => console.error("Redis Client Error:", err));

// Instantiate
const app = express();
app.listen(3001);

// Define session parameters
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: cookieSigner,
  })
);

// onClick generate redirect uri to spotify authorization endpoint
app.get("/initiateAuth", (req, res) => {
  const state = generateRandomString(16); //state key for integrity
  let url = spotifyAuthUrl;
  url += "?client_id=" + clientId;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(authCallback);
  url += "&show_dialog=true";
  url +=
    "&scope=playlist-read-private" +
    "%20playlist-read-collaborative" +
    "%20playlist-modify-private" +
    "%20playlist-modify-public" +
    "%20ugc-image-upload";
  url += "&state=" + state;
  req.session.state = state;
  res.status(200).json({ next: url });
});

app.get("/authorizationCallback", (req, res) => {
  // Reach spotify endpoint, generate tokens, return tokens, redirect user
  // Spotify response
  const code = req.query.code;
  const spotifyState = req.query.state;

  // Generated session state
  const sessionState = req.session.state;

  // Check spotifyState against sessionState to ensure integrity
  const authorizationComplete =
    code && spotifyState && spotifyState === sessionState ? true : false;

  if (!authorizationComplete) {
    // Not complete or integrity lost
    res.redirect(entryPoint);
  } else {
    // Begin token generation
    const authBody =
      "grant_type=authorization_code" +
      "&code=" +
      code +
      "&redirect_uri=" +
      encodeURI(authCallback) +
      "&client_id=" +
      clientId;
    fetch(spotifyTokenUrl, {
      body: authBody,
      headers: {
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })
      .then((response) => {
        if (response.ok) {
          // Successful token generation
          return response.json();
        } else {
          throw new Error("Response not OK");
        }
      })
      .then((jsonData) => {
        const date = new Date();
        const expiryTime = date.getTime() + 1000 * jsonData.expires_in;
        return {
          access_token: jsonData.access_token,
          expires: expiryTime,
          refresh_token: jsonData.refresh_token,
        };
      })
      .then((tokens) => {
        // Store tokens in session, redirect user to "/home"
        req.session.tokens = tokens;
        res.redirect("http://127.0.0.1:3000/sequencer");
      })
      .catch((error) => {
        // Something went wrong, send user to index page
        // console.error(error)
        res.redirect(entryPoint);
      });
  }
});

// This endpoint is reached to ensure both client and server agree on tokens
app.use("/AccessToken", bodyParser.json());
app.post("/AccessToken", (req, res) => {
  if (req.session.tokens) {
    // New or continuing session -> overwrite client
    res.json({
      access_token: req.session.tokens.access_token,
      expires: req.session.tokens.expires,
      refresh_token: req.session.tokens.refresh_token,
    });
  } else if (
    !req.session.tokens &&
    req.body.refresh_token &&
    req.body.access_token &&
    req.body.expires
  ) {
    // Session ended but user had a previous session
    // Get the most recent credentials used by client
    req.session.tokens = {
      access_token: req.body.access_token,
      expires: req.body.expires,
      refresh_token: req.body.refresh_token,
    };

    res.json({
      access_token: req.session.tokens.access_token,
      expires: req.session.tokens.expires,
      refresh_token: req.session.tokens.refresh_token,
    });
  } else {
    res.json({
      redirect_uri: entryPoint,
    }); // Send redirect
  }
});

app.use("/RefreshToken", bodyParser.json());
app.post("/RefreshToken", (req, res) => {
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) {
    // Missing credentials
    res.json({
      redirect_uri: entryPoint,
    }); // Send redirect
  } else {
    fetch(
      spotifyTokenUrl +
        "?grant_type=refresh_token&refresh_token=" +
        refresh_token,
      {
        headers: {
          Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
          "content-type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Response not OK");
        }
      })
      .then((jsonData) => {
        const date = new Date();
        const expiryTime = date.getTime() + 1000 * jsonData.expires_in;
        return {
          access_token: jsonData.access_token,
          expires: expiryTime,
          refresh_token: refresh_token,
        };
      })
      .then((tokens) => {
        // Store tokens in session and send to user
        req.session.tokens = tokens;
        res.json({
          access_token: req.session.tokens.access_token,
          expires: req.session.tokens.expires,
          refresh_token: req.session.tokens.refresh_token,
        });
      })
      .catch((error) => {
        // console.error(error)
        res.json({
          redirect_uri: entryPoint,
        }); // Send redirect
      });
  }
});

app.use("/Unauthorize", bodyParser.json());
app.post("/Unauthorize", async (req, res) => {
  // Destroy session (if it exists)
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        res.json({
          destroyed: false,
        });
      } else {
        res.json({
          destroyed: true,
        });
      }
    });
  } else {
    res.json({
      destroyed: true,
    });
  }
  // Remove from cache
  const userId = req.body.userId;
  try {
    await client.del(`user:${userId}`);
  } catch (error) {
    console.error(error);
  }
});

app.use("/createUserCache", bodyParser.json());
app.post("/createUserCache", async (req, res) => {
  const { userId, profilePicUrl } = req.body;
  await client.json.set(`user:${userId}`, "$", {
    userId: userId,
    profilePicUrl: profilePicUrl,
  });
  console.log("CREATED USER");
  await client.expire(`user:${userId}`, 3600); // Expire key in one hour
  res.status(200).send("OK");
});

app.use("/getUserCache", bodyParser.json());
app.post("/getUserCache", async (req, res) => {
  console.log(req.body.userId);
  const userId = req.body.userId;
  const cachedUser = await client.json.get(`user:${userId}`);
  console.log("Cached user", cachedUser);
  if (cachedUser) {
    await client.expire(`user:${userId}`, 3600); // Refresh key to last another one hour
    res.json({ userCache: cachedUser });
  } else {
    console.log("No user");
    // No user cached (e.g. returning user that has been dropped from memory)
    res.status(404).json();
  }
});
const generateRandomString = function (length) {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (text.length < length) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Serve built react
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});
