import express from "express";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();

// Sequence credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Important URLs
const entryPoint = "/";
const authCallback = "http://192.168.20.126/api/authorizationCallback";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";

router.get("/", (req, res) => {
  // Reach spotify endpoint, generate tokens, return tokens, redirect user
  // Spotify response
  const code = req.query.code;
  const spotifyState = sanitizeInput(req.query.state);

  // Generated session state
  const sessionState = sanitizeInput(req.session.state);

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
        res.redirect("/sequencer");
      })
      .catch((error) => {
        // Something went wrong, send user to index page
        // console.error(error)
        res.redirect(entryPoint);
      });
  }
});

export default router;
