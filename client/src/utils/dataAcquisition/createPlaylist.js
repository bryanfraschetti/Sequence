import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";

export const createPlaylist = async (SequencingModeString, NewSequence) => {
  const tokensExpired = tokenTimeValidity();
  const access_token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");
  const playlistName = localStorage.getItem("playlistName");

  if (tokensExpired) {
    await refreshTokens();
  }

  fetch("https://api.spotify.com/v1/users/" + userId + "/playlists", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: " Bearer " + access_token,
    },
    body: JSON.stringify({ name: SequencingModeString + playlistName }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response);
      }
    })
    .then((response) => {
      const newPlaylistURISplit = response.href.split("/"); //split uri by "/""
      //get string after the last "/" as this corresponds to the id of the created playlist
      const newPlaylistId = newPlaylistURISplit[newPlaylistURISplit.length - 1];

      //for every element in the new sequencing, add an element in the uri list that is a string "spotify:track:"{{ track_id }}
      //https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist has info on how to do this
      //see the section on that page: Body application/json > uris array of strings
      const trackURIList = []; //array of uris
      NewSequence.forEach((song) => {
        trackURIList.push("spotify:track:" + song.track_id);
      });

      const uriJSONString = JSON.stringify({ uris: trackURIList }); //convert uri_list to json and pass this as body

      fetch("https://api.spotify.com/v1/playlists/" + newPlaylistId + "/tracks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: " Bearer " + access_token,
        },
        body: uriJSONString,
      }).then((response) => {
        ActivateAnimation();
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
