import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { removeAllChildren } from "../styling/removeAllChildren";
import { addPlaylistToDom } from "../styling/addPlaylistToDom";
import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";

export const refreshPlaylists = async () => {
  const access_token = localStorage.getItem("access_token");
  const tokensExpired = tokenTimeValidity();
  console.log("in playlists function");
  if (tokensExpired) {
    await refreshTokens();
  }

  removeAllChildren("playlist-list"); // Get rid of all playlists in the table
  fetch("https://api.spotify.com/v1/me/playlists?limit=50&offset=0", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: " Bearer " + access_token,
    },
  })
    .then((response) => {
      console.log(response);
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response);
      }
    })
    .then((response) => {
      response.items.forEach((playlistItem) => addPlaylistToDom(playlistItem));

      const numPlaylists = response.total; // Total number of playlists
      // 50 can be fetched at a time
      const numFetches = Math.ceil(numPlaylists / 50) - 1; // Total number of required fetches (one fetch has already occured)
      for (let i = 1; i <= numFetches; i++) {
        // Get maximum number of playlists as many times as needed to get all playlists
        fetch(
          "https://api.spotify.com/v1/me/playlists?limit=50&offset=" + 50 * i,
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
            response.items.forEach((playlistItem) =>
              addPlaylistToDom(playlistItem)
            );
          })
          .catch((error) => {
            ActivateErrorNotice(error);
          });
      }
    })
    .catch((error) => {
      ActivateErrorNotice(error);
    });
};
