import express from "express";
import client from "../../redisClient.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import { logger } from "../../utils/logger.js";

const router = express.Router();

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.get("/:trackId", async (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  const trackId = req.params.trackId;
  //   console.log(trackId);
  const sanitizedTrackId = sanitizeInput(trackId);

  const trackInfo = await client.json.get(`track:${sanitizedTrackId}`);
  await client.expire(`track:${sanitizedTrackId}`, TTL);

  //   console.log(trackInfo);
  if (trackInfo) {
    res.status(200).json(JSON.parse(trackInfo));
  } else {
    res.status(404).json();
  }
});

export default router;
