import express from "express";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();
router.use(bodyParser.json());

router.post("/", async (req, res) => {
  // Remove from cache
  const userId = sanitizeInput(req.body.userId);
  try {
    await client.del(`user:${userId}`);
  } catch (error) {
    console.error(error);
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
