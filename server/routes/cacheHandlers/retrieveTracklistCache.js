import express from "express";
import client from "../../redisClient.js";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.get("/:playlistId/:userId", async (req, res) => {
  const userId = req.params.userId;
  const playlistId = req.params.playlistId;

  const sanitizedUserId = sanitizeInput(userId);
  const sanitizedPlaylistId = sanitizeInput(playlistId);

  await client.expire(`user:${sanitizedUserId}`, TTL); // Refresh key to last another TTL

  const cachedUser = await client.json.get(`user:${sanitizedUserId}`);

  if (!cachedUser) {
    res.status(404).json();
  } else {
    try {
      const expectedNumSongs = cachedUser[sanitizedPlaylistId].expectedNumSongs;
      const cachedTrackListString = cachedUser[sanitizedPlaylistId].songList;
      if (!cachedTrackListString) {
        // No cached track list
        res.status(404).json();
      } else {
        try {
          const cachedTrackList = JSON.parse(cachedTrackListString);

          res.status(200).json({
            expectedNumSongs: expectedNumSongs,
            cachedTrackList: cachedTrackList,
          });
        } catch (err) {
          res.status(404).json();
        }
      }
    } catch {
      res.status(404).json();
    }
  }
});

export default router;
