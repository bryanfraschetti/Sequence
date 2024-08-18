import express from "express";
import client from "../../redisClient.js";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;
const TTL = process.env.TTL; // Auto expiry of cache (time to live)
import { logger } from "../../utils/logger.js";
import { errorLogger } from "../../utils/errorLogger.js";

const router = express.Router();
router.use(bodyParser.json());

router.post("/", async (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  try {
    const authHeader = req.headers["authorization"];
    const JWT = authHeader && authHeader.split(" ")[1];
    const decodedJWT = jwt.verify(JWT, jwtSecret);

    if (decodedJWT) {
      const profilePicUrl = req.body.profilePicUrl;
      const userId = decodedJWT.userId;

      const sanitizedUserId = sanitizeInput(userId);
      const sanitizedProfilePicUrl = encodeURIComponent(profilePicUrl);

      await client.json.set(`user:${sanitizedUserId}`, "$", {
        userId: userId,
        profilePicUrl: sanitizedProfilePicUrl,
      });

      await client.expire(`user:${sanitizedUserId}`, TTL); // Expire key in TTL

      res.status(201).json({
        userId: userId,
        profilePicUrl: sanitizedProfilePicUrl,
      });
    } else {
      res.status(401).json();
    }
  } catch (error) {
    errorLogger.error(
      `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
    );
    res.status(401).json();
  }
});

export default router;
