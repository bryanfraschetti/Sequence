import express from "express";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();
router.use(bodyParser.json());

// Sequence credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Important URLs
const entryPoint = "http://127.0.0.1/";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";

router.post("/", (req, res) => {
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

export default router;
