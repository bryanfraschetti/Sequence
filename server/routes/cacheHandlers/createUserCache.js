import express from "express";
import client from "../../redisClient.js";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();
router.use(bodyParser.json());

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.post("/", async (req, res) => {
  const { userId, profilePicUrl } = req.body;

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
});

export default router;
