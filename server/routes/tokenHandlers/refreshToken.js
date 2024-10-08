import express from "express";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import jwt from "jsonwebtoken";
import { logger } from "../../utils/logger.js";
import { errorLogger } from "../../utils/errorLogger.js";
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();
router.use(bodyParser.json());

// Sequence credentials
const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

// Important URLs
const entryPoint = "/";
const spotifyTokenUrl = "https://accounts.spotify.com/api/token";

router.post("/", (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  const refresh_token = req.body.refresh_token;
  const JWT = req.body.JWT;
  try {
    if (!refresh_token || !jwt.verify(JWT, jwtSecret)) {
      // Missing credentials
      res.json({
        redirect_uri: "/401",
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
          const verifiedJwt = jwt.verify(JWT, jwtSecret);
          const userId = verifiedJwt.userId;

          const payload = {
            refreshToken: tokens.refresh_token,
            userId: userId,
          };

          const JWTNew = jwt.sign(payload, jwtSecret);

          // Store tokens in session and send to user
          req.session.tokens = tokens;
          req.session.JWT = JWTNew;
          req.session.userId = userId;

          res.json({
            access_token: tokens.access_token,
            expires: tokens.expires,
            refresh_token: tokens.refresh_token,
            userId: userId,
            JWT: JWTNew,
          });
        })
        .catch((error) => {
          // console.error(error)
          errorLogger.error(
            `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
          );
          res.json({
            redirect_uri: entryPoint,
          }); // Send redirect
        });
    }
  } catch (error) {
    errorLogger.error(
      `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
    );
    res.json({
      redirect_uri: entryPoint,
    }); // Send redirect
  }
});

export default router;
