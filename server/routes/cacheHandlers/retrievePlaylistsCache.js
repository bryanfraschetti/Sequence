import express from "express";
import client from "../../redisClient.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import jwt from "jsonwebtoken";
import { logger } from "../../utils/logger.js";
import { errorLogger } from "../../utils/errorLogger.js";
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.get("/:userId", async (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  try {
    const authHeader = req.headers["authorization"];
    const JWT = authHeader && authHeader.split(" ")[1];
    const decodedJWT = jwt.verify(JWT, jwtSecret);

    const userId = decodedJWT.userId;
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
  } catch (error) {
    errorLogger.error(
      `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
    );
    res.status(401).json();
  }
});

export default router;
