import express from "express";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();
router.use(bodyParser.json());

// Important URLs
const entryPoint = "/";

router.post("/", (req, res) => {
  if (req.session.tokens) {
    // New or continuing session -> overwrite client
    res.json({
      access_token: req.session.tokens.access_token,
      expires: req.session.tokens.expires,
      refresh_token: req.session.tokens.refresh_token,
    });
  } else if (
    !req.session.tokens &&
    req.body.refresh_token &&
    req.body.access_token &&
    req.body.expires
  ) {
    // Session ended but user had a previous session
    // Get the most recent credentials used by client
    req.session.tokens = {
      access_token: sanitizeInput(req.body.access_token),
      expires: sanitizeInput(req.body.expires),
      refresh_token: sanitizeInput(req.body.refresh_token),
    };

    res.json({
      access_token: sanitizeInput(req.session.tokens.access_token),
      expires: sanitizeInput(req.session.tokens.expires),
      refresh_token: sanitizeInput(req.session.tokens.refresh_token),
    });
  } else {
    res.json({
      redirect_uri: entryPoint,
    }); // Send redirect
  }
});

export default router;
