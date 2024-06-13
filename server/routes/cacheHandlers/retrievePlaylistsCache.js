import express from "express";
import client from "../../redisClient.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
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
});

export default router;
