import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { removeAllChildren } from "../styling/removeAllChildren";
import { getAudioAnalysis } from "../dataAcquisition/getAudioAnalysis";
import { InitializeTrackTable } from "../styling/InitializeTrackTable";
import { addTrackToDom } from "../styling/addTrackToDom";

export const playlistSelectionListener = () => {
  const playlistList = document.getElementById("playlist-list");

  playlistList.addEventListener("click", async function selectPlaylist(e) {
    e.preventDefault();
    if (e.target.classList.contains("playlist-title")) {
      ActivateAnimation();
      const playlistId = e.target.id;
      const playlistName = e.target.innerHTML;
      localStorage.setItem("playlistName", playlistName); //selected playlist name
      const access_token = localStorage.getItem("access_token");
      const tokensExpired = tokenTimeValidity();

      if (tokensExpired) {
        await refreshTokens();
      }

      fetch("https://api.spotify.com/v1/playlists/" + playlistId + "/tracks", {
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
          //Update UI
          removeAllChildren("tracks-table"); //clear any existing tracks

          const tracksHeader = document.getElementById("tracklist-heading");
          tracksHeader.innerHTML = '"' + playlistName + '" Tracklist'; //Reflect selected playlist

          const EmptyStateContainer = document.getElementById("EmptyStateContainer");

          const num_songs = response.total;
          if (num_songs === 0) {
            //if no songs, display empty state art
            EmptyStateContainer.style.display = "block"; //if songs, don't show empty state
            EmptyStateContainer.children[1].innerHTML =
              "This playlist does not appear to have any songs :( Try adding some and coming back later";
          } else {
            EmptyStateContainer.style.display = "none"; //if songs, don't show empty state
            InitializeTrackTable();
            response.items.forEach(async (trackInfo) => {
              addTrackToDom(trackInfo);

              getAudioAnalysis(trackInfo.track.id, trackInfo.track.name); //for each track get audio analysis
              //getAudioFeatures(trackInfo.track.id, trackInfo.track.name)
            });
          }

          ActivateAnimation();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  });
};
