import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";
import { getAudioAnalysisSpotify } from "./getAudioAnalysisSpotify";
import { SequenceNamespace } from "../SequenceNamespace";
import { updateTracksTableContent } from "../styling/updateTracksTableContents";
import { ActivateAnimation } from "../styling/ActivateAnimation";
import { updatePlaylistTracklistCache } from "../updateCache/updatePlaylistTracklistCache";
import { getAudioAnalysisCache } from "../checkCache/getAudioAnalysisCache";

export const getPlaylistTracks = async () => {
  const playlistId = SequenceNamespace.getVar("playlistId");
  const access_token = localStorage.getItem("access_token");
  console.log("Getting Playlist Tracks from Spotify");

  fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: " Bearer " + access_token,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response);
      }
    })
    .then(async (response) => {
      // Only retain tracks (remove podcasts)
      const filteredTracks = response.items.filter((trackInfo) => {
        return trackInfo.track.type === "track";
      });

      const numSongs = filteredTracks.length;
      SequenceNamespace.setVar("expectedNumSongs", numSongs);

      // Update UI
      updateTracksTableContent(numSongs);
      await updatePlaylistTracklistCache(filteredTracks);

      if (numSongs === 0) {
        ActivateAnimation();
      }

      filteredTracks.forEach(async (trackInfo) => {
        const songInfo = await getAudioAnalysisCache(trackInfo.track.id);
        if (songInfo) {
          SequenceNamespace.appendArray("songList", songInfo);
        } else {
          getAudioAnalysisSpotify({
            trackId: trackInfo.track.id,
            name: trackInfo.track.name,
            albumArtSrc: trackInfo.track.album.images[0].url,
            artist: trackInfo.track.artists[0].name,
          });
        }
      });
    })
    .catch((error) => {
      ActivateErrorNotice(error);
    });
};
