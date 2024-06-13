import express from "express";
import client from "../../redisClient.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.get("/:userId", async (req, res) => {
  const userId = req.params.userId;
  const sanitizedUserId = sanitizeInput(userId);
  const cachedUser = await client.json.get(`user:${sanitizedUserId}`);

  if (cachedUser) {
    await client.expire(`user:${sanitizedUserId}`, TTL); // Refresh key to last another TTL
    cachedUser.profilePicUrl = decodeURIComponent(cachedUser.profilePicUrl);
    res.status(200).json({ userCache: cachedUser });
  } else {
    // No user cached (e.g. returning user that has been dropped from memory)
    res.status(404).json();
  }
});

export default router;
