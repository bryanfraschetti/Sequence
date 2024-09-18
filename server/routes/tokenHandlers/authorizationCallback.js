import express from "express";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import jwt from "jsonwebtoken";
import { updateUserCache } from "../../utils/updateUserCache.js";
const jwtSecret = process.env.JWT_SECRET;
import { logger } from "../../utils/logger.js";
import { errorLogger } from "../../utils/errorLogger.js";
const router = express.Router();

// Sequence credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Important URLs
const entryPoint = "/";
const authCallback = "https://sequencewav.com/api/authorizationCallback";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";

router.get("/", (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  // Reach spotify endpoint, generate tokens, return tokens, redirect user
  // Spotify response
  const code = req.query.code;
  const spotifyState = sanitizeInput(req.query.state);

  // Generated session state
  const sessionState = sanitizeInput(req.session.state);

  // Check spotifyState against sessionState to ensure integrity
  const authorizationComplete =
    code && spotifyState === sessionState ? true : false;

  if (!authorizationComplete) {
    // Not complete or integrity lost
    errorLogger.error(
      `ERR ${req.method} ${req.originalUrl} - ${req.ip} | Code: ${code} Spotify Code: ${spotifyState} Session Code: ${sessionState}`
    );
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

        const access_token = tokens.access_token;

        fetch("https://api.spotify.com/v1/me", {
          // Spotify user end point
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: " Bearer " + access_token,
          },
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error(response);
            }
          })
          .then(async (response) => {
            const userId = response.id;
            const images = response.images;
            const profilePicUrl = images.length > 0 ? images[0].url : null;

            const payload = {
              refreshToken: tokens.refresh_token,
              userId: userId,
            };

            const JWT = jwt.sign(payload, jwtSecret);

            logger.info(`User requesting access: ${userId}. JWT: ${JWT}`);

            req.session.JWT = JWT;
            req.session.userId = userId;

            await updateUserCache(userId, profilePicUrl, JWT);

            res.redirect("/sequencer");
          })
          .catch((error) => {
            errorLogger.error(
              `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
            );
            res.redirect(entryPoint);
          });
      })
      .catch((error) => {
        errorLogger.error(
          `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
        );
        // Something went wrong, send user to index page
        // console.error(error)
        res.redirect(entryPoint);
      });
  }
});

export default router;
