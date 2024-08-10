import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { removeAllChildren } from "../styling/removeAllChildren";
import { addPlaylistToDom } from "../styling/addPlaylistToDom";
import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";
import { SequenceNamespace } from "../SequenceNamespace";

export const getPlaylistsSpotify = async () => {
  const access_token = localStorage.getItem("access_token");
  const tokensExpired = tokenTimeValidity();
  //   console.log("Getting Playlists from Spotify");
  if (tokensExpired) {
    await refreshTokens();
  }

  removeAllChildren("playlist-list"); // Get rid of all playlists in the table
  SequenceNamespace.setVar("playlistList", []); // Clear client playlistList

  await fetch("https://api.spotify.com/v1/me/playlists?limit=50&offset=0", {
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
      //   console.log(response);
      response.items.forEach((playlistItem) => {
        // console.log(playlistItem);
        // Reduce to necessary properties before function call
        const playlist = {
          id: playlistItem.id,
          images: playlistItem.images ? playlistItem.images : [{ url: "null" }],
          name: playlistItem.name,
        };
        addPlaylistToDom(playlist); // Add playlist to DOM
        // Client side list of playlists to upload to cache on success
        SequenceNamespace.appendArray("playlistList", playlist);
      });

      const numPlaylists = response.total; // Total number of playlists

      // 50 can be fetched at a time
      // Total number of required fetches is ceil(numPlaylists/50)
      // Note that one fetch has already occured, so we can subtract one

      const numFetches = Math.ceil(numPlaylists / 50) - 1;
      for (let i = 1; i <= numFetches; i++) {
        // Get maximum number of playlists as many times as needed to get all playlists
        await fetch(
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
            // console.log(response);
            response.items.forEach((playlistItem) => {
              //   console.log(playlistItem);
              // Reduce to necessary properties before function call
              const playlist = {
                id: playlistItem.id,
                images: playlistItem.images
                  ? playlistItem.images
                  : [{ url: "null" }],
                name: playlistItem.name,
              };
              addPlaylistToDom(playlist); // Add playlist to DOM
              // Client side list of playlists to upload to cache on success
              SequenceNamespace.appendArray("playlistList", playlist);
            });
          })
          .catch((error) => {
            ActivateErrorNotice(error);
          });
      }
    })
    .catch((error) => {
      //   ActivateErrorNotice(error);
    });
};
