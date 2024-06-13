import express from "express";
import client from "../../redisClient.js";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();
router.use(bodyParser.json());

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.post("/:userId", async (req, res) => {
  const { playlistList } = req.body;
  const userId = req.params.userId;

  const sanitizedUserId = sanitizeInput(userId);

  // Update Redis JSON in place
  await client.json.set(
    `user:${sanitizedUserId}`,
    "$.playlistList",
    JSON.stringify(playlistList)
  );

  await client.expire(`user:${sanitizedUserId}`, TTL); // Expire key in TTL

  res.status(200).json();
});

export default router;
