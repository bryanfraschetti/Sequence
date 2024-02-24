import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { removeAllChildren } from "../styling/removeAllChildren";
import { addPlaylistToDom } from "../styling/addPlaylistToDom";
import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";

export const refreshPlaylists = async () => {
  const access_token = localStorage.getItem("access_token");
  const tokensExpired = tokenTimeValidity();

  if (tokensExpired) {
    await refreshTokens();
  }

  fetch("https://api.spotify.com/v1/me/playlists?limit=0&offset=0", {
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
      removeAllChildren("playlist-list"); //get rid of all playlists in the table

      const num_playlists = response.total; //total number of playlists
      for (let i = 0; i <= Math.floor(num_playlists / 50); i++) {
        //get maximum number of playlists as many times as needed to get all playlists
        fetch("https://api.spotify.com/v1/me/playlists?limit=50&offset=" + 50 * i, {
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
            response.items.forEach((playlistItem) => addPlaylistToDom(playlistItem));
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
