import { ActivateAnimation } from "../styling/ActivateAnimation";
import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { SequenceNamespace } from "../SequenceNamespace";
import { ActivateErrorNotice } from "../styling/ActivateErrorNotice";

export const createPlaylist = async (SequencingModeString, NewSequence) => {
  const tokensExpired = tokenTimeValidity();
  const access_token = localStorage.getItem("access_token");
  const userId = localStorage.getItem("userId");
  const playlistName = SequenceNamespace.getVar("playlistName");
  const base64ImageString =
    "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";

  if (tokensExpired) {
    await refreshTokens();
  }

  fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: " Bearer " + access_token,
    },
    body: JSON.stringify({ name: `${SequencingModeString} ${playlistName}` }),
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

      //for every element in the new sequencing, add an element in the uri list that is a string "spotify:track:"{{ trackId }}
      //https://developer.spotify.com/documentation/web-api/reference/#/operations/add-tracks-to-playlist has info on how to do this
      //see the section on that page: Body application/json > uris array of strings
      const trackURIList = []; //array of uris
      NewSequence.forEach((song) => {
        trackURIList.push("spotify:track:" + song.trackId);
      });

      const uriJSONString = JSON.stringify({ uris: trackURIList }); //convert uri_list to json and pass this as body

      fetch(`https://api.spotify.com/v1/playlists/${newPlaylistId}/tracks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: " Bearer " + access_token,
        },
        body: uriJSONString,
      }).then((response) => {
        ActivateAnimation();
      });

      fetch(`https://api.spotify.com/v1/playlists/${newPlaylistId}/images`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: " Bearer " + access_token,
        },
        body: base64ImageString,
      });
    })
    .catch((error) => {
      ActivateErrorNotice(error);
      // console.error(error);
    });
};
