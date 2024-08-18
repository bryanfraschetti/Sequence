import express from "express";
import bodyParser from "body-parser";
import client from "../../redisClient.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";
import { logger } from "../../utils/logger.js";
import { errorLogger } from "../../utils/errorLogger.js";

const router = express.Router();
router.use(bodyParser.json());

router.post("/", async (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  // Remove from cache
  const userId = sanitizeInput(req.body.userId);
  try {
    await client.del(`user:${userId}`);
  } catch (error) {
    errorLogger.error(
      `ERR ${req.method} ${req.originalUrl} - ${req.ip} | ${error}`
    );
    // console.error(error);
  }

  // Destroy session (if it exists)
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        res.json({
          destroyed: false,
        });
      } else {
        res.json({
          destroyed: true,
        });
      }
    });
  } else {
    res.json({
      destroyed: true,
    });
  }
});

export default router;
