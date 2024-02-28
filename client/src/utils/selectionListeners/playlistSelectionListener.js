import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { removeAllChildren } from "../styling/removeAllChildren";
import { getAudioAnalysis } from "../dataAcquisition/getAudioAnalysis";
import { InitializeTrackTable } from "../styling/InitializeTrackTable";
import { addTrackToDom } from "../styling/addTrackToDom";
import { SequenceNamespace } from "../SequenceNamespace";
import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";

export const playlistSelectionListener = () => {
  const playlistList = document.getElementById("playlist-list");

  playlistList.addEventListener("click", async function selectPlaylist(e) {
    e.preventDefault();
    if (e.target.classList.contains("playlist-title")) {
      ActivateAnimation();
      SequenceNamespace.setVar("songList", []);

      const playlistId = e.target.id;
      SequenceNamespace.setVar("playlistId", playlistId);
      const playlistName = e.target.innerHTML;
      SequenceNamespace.setVar("playlistName", playlistName);

      const access_token = localStorage.getItem("access_token");
      const tokensExpired = tokenTimeValidity();

      if (tokensExpired) {
        await refreshTokens();
      }
      await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: " Bearer " + access_token,
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error(response);
          }
        })
        .then((response) => {
          // Update UI
          removeAllChildren("tracks-table"); // Clear any existing tracks
          const tracksHeader = document.getElementById("tracklist-heading");
          tracksHeader.innerHTML = '"' + playlistName + '" Tracklist'; // Reflect selected playlist

          const filteredTracks = response.items.filter((trackInfo) => {
            return trackInfo.track.type === "track";
          });

          const numSongs = filteredTracks.length;
          localStorage.setItem("expectedNumSongs", numSongs);

          const EmptyStateContainer = document.getElementById(
            "EmptyStateContainer"
          );
          if (numSongs === 0) {
            // If no songs, display empty state art
            EmptyStateContainer.style.display = "block"; // If songs, don't show empty state
            EmptyStateContainer.children[1].innerHTML =
              "This playlist does not appear to have any songs :( Try adding some and coming back later";
          } else {
            EmptyStateContainer.style.display = "none"; // If songs, don't show empty state
            InitializeTrackTable();
            filteredTracks.forEach((trackInfo) => {
              addTrackToDom(trackInfo);
              getAudioAnalysis(trackInfo.track.id, trackInfo.track.name);
              // await getAudioFeatures(trackInfo.track.id, trackInfo.track.name);
            });
          }
        })
        .catch((error) => {
          ActivateErrorNotice(error);
        });
    }
  });
};
