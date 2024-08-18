import express from "express";
import client from "../../redisClient.js";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import { logger } from "../../utils/logger.js";
import { errorLogger } from "../../utils/errorLogger.js";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;

const router = express.Router();
router.use(bodyParser.json());

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.post("/:userId", async (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  try {
    const authHeader = req.headers["authorization"];
    const JWT = authHeader && authHeader.split(" ")[1];
    const decodedJWT = jwt.verify(JWT, jwtSecret);

    const userId = decodedJWT.userId;
    const { playlistList } = req.body;

    const sanitizedUserId = sanitizeInput(userId);

    // Update Redis JSON in place
    await client.json.set(
      `user:${sanitizedUserId}`,
      "$.playlistList",
      JSON.stringify(playlistList)
    );

    await client.expire(`user:${sanitizedUserId}`, TTL); // Expire key in TTL

    res.status(200).json();
  } catch (error) {
    errorLogger.error(
      `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
    );
    res.status(401).json();
  }
});

export default router;
