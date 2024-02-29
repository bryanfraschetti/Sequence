import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { SequenceNamespace } from "../SequenceNamespace";
import { getAudioAnalysisCache } from "../checkCache/getAudioAnalysisCache";
import { getPlaylistTracks } from "../accessSpotify/getPlaylistTracks";
import { updateTracksTableTitle } from "../styling/updateTracksTableTitle";

export const playlistSelectionListener = () => {
  const playlistList = document.getElementById("playlist-list");

  playlistList.addEventListener("click", async function selectPlaylist(e) {
    e.preventDefault();
    if (e.target.classList.contains("playlist-title")) {
      ActivateAnimation();

      // Update Namespace regarding selections
      SequenceNamespace.setVar("songList", []);
      const playlistId = e.target.id;
      const playlistName = e.target.innerHTML;
      SequenceNamespace.setVar("playlistId", playlistId);
      SequenceNamespace.setVar("playlistName", playlistName);

      // Update UI
      updateTracksTableTitle(playlistName);

      const cached = await getAudioAnalysisCache();

      if (!cached) {
        // Keep track that track list was not cached to enable writing to cache
        SequenceNamespace.setVar("songListFromCache", false);

        const tokensExpired = tokenTimeValidity();
        if (tokensExpired) {
          await refreshTokens();
        }

        getPlaylistTracks();
      }
    }
  });
};
