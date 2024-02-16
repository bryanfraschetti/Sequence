//confidential app credentials
require("dotenv").config();
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const cookieSigner = process.env.COOKIE_SIGNER;

//frequent uris
const spotifyAuthUrl = "https://accounts.spotify.com/authorize";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";
const entryPoint = "http://127.0.0.1:3000/";
const authCallback = "http://127.0.0.1:3001/authorizationCallback";

//modules
const express = require("express");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
// const { createProxyMiddleware } = require("http-proxy-middleware");

//instantiate
const app = express();
app.listen(3001);

//define session parameters
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: cookieSigner,
  })
);

//onClick generate redirect uri to spotify authorization endpoint
app.get("/initiateAuth", (req, res) => {
  const state = generateRandomString(16); //state key for integrity
  let url = spotifyAuthUrl;
  url += "?client_id=" + clientId;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(authCallback);
  url += "&show_dialog=true";
  url +=
    "&scope=user-read-currently-playing" +
    "%20playlist-read-private" +
    "%20playlist-read-collaborative" +
    "%20playlist-modify-private" +
    "%20playlist-modify-public";
  url += "&state=" + state;
  req.session.state = state;
  res.status(200).json({ next: url });
});

app.get("/authorizationCallback", (req, res) => {
  //reach spotify endpoint, generate tokens, return tokens, redirect user
  //spotify response
  const code = req.query.code;
  const spotifyState = req.query.state;

  //generated session state
  const sessionState = req.session.state;

  //check spotifyState against sessionState to ensure integrity
  const authorizationComplete =
    code && spotifyState && spotifyState === sessionState ? true : false;

  if (!authorizationComplete) {
    //not complete or integrity lost
    res.redirect(entryPoint);
  } else {
    //begin token generation
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
          //successful token generation
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
        //store tokens in session, redirect user to "/home"
        req.session.tokens = tokens;
        res.redirect("http://127.0.0.1:3000/sequencer");
      })
      .catch((error) => {
        //something went wrong, send user to index page
        // console.error(error)
        res.redirect(entryPoint);
      });
  }
});

//this endpoint is reached to ensure both client and server agree on tokens
app.use("/AccessToken", bodyParser.json());
app.post("/AccessToken", (req, res) => {
  if (req.session.tokens) {
    //new or continuing session -> overwrite client
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
    //session ended but user had a previous session
    //get the most recent credentials used by client
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
    }); //send redirect
  }
});

app.use("/RefreshToken", bodyParser.json());
app.post("/RefreshToken", (req, res) => {
  const refresh_token = req.body.refresh_token;
  if (!refresh_token) {
    //missing credentials
    res.json({
      redirect_uri: entryPoint,
    }); //send redirect
  } else {
    fetch(spotifyTokenUrl + "?grant_type=refresh_token&refresh_token=" + refresh_token, {
      headers: {
        Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
        "content-type": "application/x-www-form-urlencoded",
      },
      method: "POST",
    })
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
        //store tokens in session and send to user
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
        }); //send redirect
      });
  }
});

app.get("/Unauthorize", (req, res) => {
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
});

const generateRandomString = function (length) {
  let text = "";
  let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  while (text.length < length) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

//handle css serving
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.set("Content-Type", "text/css");
      }
    },
  })
);

//handle js serving
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.set("Content-Type", "text/javascript");
      }
    },
  })
);

// serve built react
app.use(express.static(path.join(__dirname, "../client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// unresponsive original design
// app.get("/", (req, res) => {
//   //main entry point always give index.html
//   res.sendFile(path.join(__dirname, "public", "html", "index.html"));
// });

// app.get("/home", (req, res) => {
//   //always give home.html
//   res.sendFile(path.join(__dirname, "public", "html", "home.html"));
// });
