import express from "express";
import { generateRandomString } from "../../utils/generateRandomString.js";
import { logger } from "../../utils/logger.js";

const router = express.Router();

// Sequence Id
const clientId = process.env.SPOTIFY_CLIENT_ID;

// Important URLs
const spotifyAuthUrl = "https://accounts.spotify.com/authorize";
const authCallback = "http://sequencewav.com/api/authorizationCallback";

router.get("/", (req, res) => {
  logger.info(`HTTP ${req.method} ${req.originalUrl} - ${req.ip}`);

  const state = generateRandomString(16); //state key for integrity
  let url = spotifyAuthUrl;
  url += `?client_id=${clientId}`;
  url += "&response_type=code";
  url += "&redirect_uri=" + encodeURI(authCallback);
  url += "&show_dialog=true";
  url +=
    "&scope=playlist-read-private" +
    "%20playlist-read-collaborative" +
    "%20playlist-modify-private" +
    "%20playlist-modify-public" +
    "%20ugc-image-upload";
  url += "&state=" + state;
  req.session.state = state;
  res.status(200).json({ next: url });
});

export default router;
