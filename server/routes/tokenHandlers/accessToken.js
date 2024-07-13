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
    // Generate fresh tokens

    const clientTokens = {
      access_token: sanitizeInput(req.body.access_token),
      expires: sanitizeInput(req.body.expires),
      refresh_token: sanitizeInput(req.body.refresh_token),
    };

    fetch("http://nginx/api/RefreshToken", {
      // Send current state to Sequence
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        access_token: clientTokens.access_token,
        refresh_token: clientTokens.refresh_token,
        expires: clientTokens.expires,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((response) => {
        res.json(response);
      })
      .catch((error) => {
        console.error(error);

        res.json({
          redirect_uri: entryPoint,
        }); // Send redirect
      });
  } else {
    res.json({
      redirect_uri: entryPoint,
    }); // Send redirect
  }
});

export default router;
