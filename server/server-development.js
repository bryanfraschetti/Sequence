// Confidential app credentials
require("dotenv").config();
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const cookieSigner = process.env.COOKIE_SIGNER;

// Frequent uris
const spotifyAuthUrl = "https://accounts.spotify.com/authorize";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";
const entryPoint = "http://127.0.0.1:3000/";
const authCallback = "http://127.0.0.1:3001/api/authorizationCallback";

// Auto expiry of cache (time to live)
const TTL = 86400;

// Modules
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");

// Create redis client
const redis = require("redis");
const client = redis.createClient({ url: "redis://sequence-redis:6379" });
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
app.get("/api/initiateAuth", (req, res) => {
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

app.get("/api/authorizationCallback", (req, res) => {
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
app.use("/api/AccessToken", bodyParser.json());
app.post("/api/AccessToken", (req, res) => {
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
      access_token: sanitizeInput(req.body.access_token),
      expires: sanitizeInput(req.body.expires),
      refresh_token: sanitizeInput(req.body.refresh_token),
    };

    res.json({
      access_token: sanitizeInput(req.session.tokens.access_token),
      expires: sanitizeInput(req.session.tokens.expires),
      refresh_token: sanitizeInput(req.session.tokens.refresh_token),
    });
  } else {
    res.json({
      redirect_uri: entryPoint,
    }); // Send redirect
  }
});

app.use("/api/RefreshToken", bodyParser.json());
app.post("/api/RefreshToken", (req, res) => {
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
        sanitizeInput(refresh_token),
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

app.use("/api/Unauthorize", bodyParser.json());
app.post("/api/Unauthorize", async (req, res) => {
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
  const userId = sanitizeInput(req.body.userId);
  try {
    await client.del(`user:${userId}`);
  } catch (error) {
    console.error(error);
  }
});

app.use("/api/users/create", bodyParser.json());
app.post("/api/users/create", async (req, res) => {
  const { userId, profilePicUrl } = req.body;

  const sanitizedUserId = sanitizeInput(userId);
  const sanitizedProfilePicUrl = encodeURIComponent(profilePicUrl);

  await client.json.set(`user:${sanitizedUserId}`, "$", {
    userId: userId,
    profilePicUrl: sanitizedProfilePicUrl,
  });
  await client.expire(`user:${sanitizedUserId}`, TTL); // Expire key in TTL
  res.status(200).send("OK");
});

app.get("/api/users/cache/:userId", async (req, res) => {
  const userId = req.params.userId;
  const sanitizedUserId = sanitizeInput(userId);
  const cachedUser = await client.json.get(`user:${sanitizedUserId}`);
  if (cachedUser) {
    await client.expire(`user:${sanitizedUserId}`, TTL); // Refresh key to last another TTL
    cachedUser.profilePicUrl = decodeURIComponent(cachedUser.profilePicUrl);
    res.status(200).json({ userCache: cachedUser });
  } else {
    // No user cached (e.g. returning user that has been dropped from memory)
    res.status(404).json();
  }
});

app.use("/api/playlists/create/:userId", bodyParser.json());
app.post("/api/playlists/create/:userId", async (req, res) => {
  const { playlistList } = req.body;
  const userId = req.params.userId;

  const sanitizedUserId = sanitizeInput(userId);

  // Update Redis JSON in place
  await client.json.set(
    `user:${sanitizedUserId}`,
    "$.playlistList",
    JSON.stringify(playlistList)
  );
  await client.expire(`user:${sanitizedUserId}`, TTL); // Expire key in TTL
  res.status(200).json();
});

app.get("/api/playlists/cache/:userId", async (req, res) => {
  const userId = req.params.userId;
  const sanitizedUserId = sanitizeInput(userId);

  await client.expire(`user:${sanitizedUserId}`, TTL); // Refresh key to last another TTL
  const cachedUser = await client.json.get(`user:${sanitizedUserId}`);
  const cachedPlaylists = cachedUser.playlistList;

  if (cachedPlaylists) {
    res.status(200).json({ cachedPlaylists: JSON.parse(cachedPlaylists) });
  } else {
    // No cached playlist
    res.status(404).json();
  }
});

app.use("/api/updateAudioAnalysisCache", bodyParser.json());
app.post("/api/updateAudioAnalysisCache", async (req, res) => {
  const { userId, playlistId, songList, expectedNumSongs } = req.body;

  const sanitizedUserId = sanitizeInput(userId);
  const sanitizedPlaylistId = sanitizeInput(playlistId);
  const sanitizedExpectedNumSongs = sanitizeInput(expectedNumSongs);

  // Update Redis JSON in place
  await client.json.set(`user:${sanitizedUserId}`, `$.${sanitizedPlaylistId}`, {
    expectedNumSongs: sanitizedExpectedNumSongs,
    songList: JSON.stringify(songList),
  });
  await client.expire(`user:${sanitizedUserId}`, TTL); // Expire key in TTL
  res.status(200).json();
});

app.get("/api/tracks/:playlistId/:userId", async (req, res) => {
  const userId = req.params.userId;
  const playlistId = req.params.playlistId;

  const sanitizedUserId = sanitizeInput(userId);
  const sanitizedPlaylistId = sanitizeInput(playlistId);

  await client.expire(`user:${sanitizedUserId}`, TTL); // Refresh key to last another TTL
  const cachedUser = await client.json.get(`user:${sanitizedUserId}`);
  try {
    const cachedTracklist = JSON.parse(
      cachedUser[sanitizedPlaylistId].songList
    );
    const expectedNumSongs = cachedUser[sanitizedPlaylistId].expectedNumSongs;
    if (cachedTracklist) {
      res.status(200).json({
        expectedNumSongs: expectedNumSongs,
        cachedTrackList: cachedTracklist,
      });
    } else {
      // No cached track list
      res.status(404).json();
    }
  } catch (err) {
    res.status(404).json();
  }
});

app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
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

function sanitizeInput(input) {
  if (input === null || input === undefined || Number.isInteger(input)) {
    return input;
  } else if (typeof input === "string") {
    return input.replace(/[()\[\]{}<>&^$@*#=%,;?!\\\|'"`]/g, "");
  }
}
