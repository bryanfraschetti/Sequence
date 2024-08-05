import express from "express";
import client from "../../redisClient.js";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import jwt from "jsonwebtoken";
const jwtSecret = process.env.JWT_SECRET;
const TTL = process.env.TTL; // Auto expiry of cache (time to live)

const router = express.Router();
router.use(bodyParser.json());

router.post("/", async (req, res) => {
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
  } catch {
    res.status(401).json();
  }
});

export default router;
