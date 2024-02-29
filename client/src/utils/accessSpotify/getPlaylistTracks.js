import { addTrackToDom } from "../styling/addTrackToDom";
import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";
import { getAudioAnalysisSpotify } from "./getAudioAnalysisSpotify";
import { SequenceNamespace } from "../SequenceNamespace";
import { updateTracksTableContent } from "../styling/updateTracksTableContents";
import { ActivateAnimation } from "../styling/ActivateAnimation";
import { updateAudioAnalysisCache } from "../updateCache/updateAudioAnalysisCache";

export const getPlaylistTracks = () => {
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
    .then((response) => {
      // Only retain tracks (remove podcasts)
      const filteredTracks = response.items.filter((trackInfo) => {
        return trackInfo.track.type === "track";
      });

      const numSongs = filteredTracks.length;
      SequenceNamespace.setVar("expectedNumSongs", numSongs);

      // Update UI
      updateTracksTableContent(numSongs);

      if (numSongs !== 0) {
        filteredTracks.forEach((trackInfo) => {
          // Reduce JSON response to necessary fields
          const song = {
            trackId: trackInfo.track.id,
            name: trackInfo.track.name,
            albumArtSrc: trackInfo.track.album.images[0].url,
            artist: trackInfo.track.artists[0].name,
          };
          addTrackToDom(song);
          getAudioAnalysisSpotify(song);
          // await getAudioFeatures(trackInfo.track.id, trackInfo.track.name);
        });
      } else {
        // No songs so we have to manually fire this event
        updateAudioAnalysisCache();
        ActivateAnimation();
      }
    })
    .catch((error) => {
      ActivateErrorNotice(error);
    });
};
