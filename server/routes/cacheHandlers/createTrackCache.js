import express from "express";
import client from "../../redisClient.js";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();
router.use(bodyParser.json());

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.post("/:trackId", async (req, res) => {
  // Check if cached track resource already exists
  const cacheRead = await client.json.get(`track:${sanitizedTrackId}`);
  if (cacheRead) {
    // If it already exists, don't overwrite it
    res.status(418).json();
  }

  const trackId = req.params.trackId;
  const sanitizedTrackId = sanitizeInput(trackId);

  const trackInfo = req.body.trackInfo;

  await client.json.set(
    `track:${sanitizedTrackId}`,
    `$`,
    JSON.stringify(trackInfo)
  );
  await client.expire(`track:${sanitizedTrackId}`, TTL);

  res.status(200).json();
});

export default router;
