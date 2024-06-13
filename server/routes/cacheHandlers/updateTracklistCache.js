import express from "express";
import client from "../../redisClient.js";
import bodyParser from "body-parser";
import { sanitizeInput } from "../../utils/sanitizeInput.js";

const router = express.Router();
router.use(bodyParser.json());

// Auto expiry of cache (time to live)
const TTL = process.env.TTL;

router.post("/:playlistId/:userId", async (req, res) => {
  const userId = req.params.userId;
  const playlistId = req.params.playlistId;
  //   console.log(req.body);
  const { songList, expectedNumSongs } = req.body;

  const sanitizedUserId = sanitizeInput(userId);
  const sanitizedPlaylistId = sanitizeInput(playlistId);
  const sanitizedExpectedNumSongs = sanitizeInput(expectedNumSongs);

  //   const trackIdReferenceList = [];
  //   songList.forEach((song) => {
  //     trackIdReferenceList.push(sanitizeInput(song.trackId));
  //   });

  // Update Redis JSON in place
  await client.json.set(`user:${sanitizedUserId}`, `$.${sanitizedPlaylistId}`, {
    expectedNumSongs: sanitizedExpectedNumSongs,
    songList: JSON.stringify(songList),
    // trackIdReferenceList: trackIdReferenceList,
  });

  await client.expire(`user:${sanitizedUserId}`, TTL); // Expire key in TTL

  res.status(200).json();
});

export default router;
