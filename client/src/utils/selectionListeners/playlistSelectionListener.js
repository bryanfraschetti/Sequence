import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { SequenceNamespace } from "../SequenceNamespace";
import { getPlaylistTracks } from "../accessSpotify/getPlaylistTracks";
import { updateTracksTableTitle } from "../styling/updateTracksTableTitle";
import { getPlaylistTracksCache } from "../checkCache/getPlaylistTracksCache";
import { getAudioAnalysisCache } from "../checkCache/getAudioAnalysisCache";
import { updateTracksTableContent } from "../styling/updateTracksTableContents";
import { getAudioAnalysisSpotify } from "../accessSpotify/getAudioAnalysisSpotify";
import { removeAllChildren } from "../styling/removeAllChildren";

export const playlistSelectionListener = () => {
  const playlistList = document.getElementById("playlist-list");

  playlistList.addEventListener("click", async function selectPlaylist(e) {
    e.preventDefault();
    if (e.target.classList.contains("playlist-title")) {
      ActivateAnimation();

      // Update Namespace regarding selections
      SequenceNamespace.setVar("songList", []);
      SequenceNamespace.setVar("NewSequence", null);
      SequenceNamespace.setVar("playlistPrefix", "");
      const playlistId = e.target.id;
      const playlistName = e.target.innerHTML;
      SequenceNamespace.setVar("playlistId", playlistId);
      SequenceNamespace.setVar("playlistName", playlistName);

      // Update UI
      updateTracksTableTitle(playlistName);
      removeAllChildren("spotify-ext");
      removeAllChildren("export-ext");

      const { cached, expectedNumSongs, cachedTrackList } =
        await getPlaylistTracksCache();

      if (!cached) {
        const tokensExpired = tokenTimeValidity();
        if (tokensExpired) {
          await refreshTokens();
        }

        await getPlaylistTracks();
      } else {
        SequenceNamespace.setVar("expectedNumSongs", expectedNumSongs);

        updateTracksTableContent(expectedNumSongs);

        if (expectedNumSongs !== 0) {
          cachedTrackList.forEach(async (cachedTrack) => {
            ///getAudioanalysis of song
            // console.log(cachedTrack);
            const trackId = cachedTrack.trackId;
            const trackName = cachedTrack.name;
            const albumArtSrc = cachedTrack.albumArtSrc;
            const artist = cachedTrack.artist;
            const trackInfo = await getAudioAnalysisCache(trackId);
            if (trackInfo) {
              SequenceNamespace.appendArray("songList", trackInfo);
            } else {
              getAudioAnalysisSpotify({
                trackId: trackId,
                name: trackName,
                albumArtSrc: albumArtSrc,
                artist: artist,
              });
            }
            // console.log(trackInfo);
          });
        } else {
          // No songs so this event has to be fired manually
          ActivateAnimation();
        }
      }
    }
  });
};
