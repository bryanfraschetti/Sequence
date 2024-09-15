import express from "express";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;
import { logger } from "../../utils/logger.js";
import { errorLogger } from "../../utils/errorLogger.js";

const router = express.Router();
router.use(bodyParser.json());

// Important URLs
const entryPoint = "/";

router.post("/", (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  try {
    if (req.session.tokens) {
      // New or continuing session -> overwrite client
      res.json({
        access_token: req.session.tokens.access_token,
        expires: req.session.tokens.expires,
        refresh_token: req.session.tokens.refresh_token,
        JWT: req.session.JWT,
        userId: req.session.userId,
      });
    } else if (
      !req.session.tokens &&
      req.body.refresh_token &&
      req.body.access_token &&
      req.body.expires &&
      req.body.JWT &&
      jwt.verify(req.body.JWT, jwtSecret)
    ) {
      // Session ended but user had a previous session
      // Generate fresh tokens

      const clientTokens = {
        access_token: sanitizeInput(req.body.access_token),
        expires: sanitizeInput(req.body.expires),
        refresh_token: sanitizeInput(req.body.refresh_token),
        JWT: req.body.JWT,
      };

      fetch("https://sequencewav.com/api/RefreshToken", {
        // Send current state to Sequence
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          access_token: clientTokens.access_token,
          refresh_token: clientTokens.refresh_token,
          expires: clientTokens.expires,
          JWT: clientTokens.JWT,
        }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .then((response) => {
          req.session.tokens = {};
          req.session.tokens.access_token = response.access_token;
          req.session.tokens.refresh_token = response.refresh_token;
          req.session.tokens.expires = response.expires;
          req.session.JWT = response.JWT;
          req.session.userId = response.userId;
          res.json(response);
        })
        .catch((error) => {
          errorLogger.error(
            `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error.stack}`
          );
          res.json({
            redirect_uri: entryPoint,
          }); // Send redirect
        });
    } else {
      res.json({
        redirect_uri: entryPoint,
      }); // Send redirect
    }
  } catch (error) {
    errorLogger.error(
      `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
    );
    res.json({
      redirect_uri: entryPoint,
    });
  }
});

export default router;
