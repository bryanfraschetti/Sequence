import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { removeAllChildren } from "../styling/removeAllChildren";

export const refreshPlaylists = async () => {
  const access_token = localStorage.getItem("access_token");
  const playlist_list = document.getElementById("playlist-list");
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
      var num_playlists = response.total; //total number of playlists
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
            response.items.forEach((el) => {
              let node = document.createElement("li"); //create a list item
              node.id = el.id; //li id = playlist id

              let playlist_cover = document.createElement("img"); //img tag
              if (el.images.length !== 0) {
                playlist_cover.src = el.images.slice(-1)[0].url; //src for img
              }
              playlist_cover.className = "coverimg"; //all images are cover images
              node.appendChild(playlist_cover); //append img to li

              let playlist_title = document.createElement("p"); //create td for title
              playlist_title.className = "playlist-title";
              playlist_title.id = el.id; //set table cell id to playlist id
              playlist_title.innerHTML = el.name; //inner html is the title
              node.appendChild(playlist_title); //append p to li

              playlist_list.appendChild(node); //append li to ul
            });
          })
          .catch((error) => {
            // alert(error)
            window.location.href = "/";
          });
      }
    })
    .catch((error) => {
      // alert(error)
      window.location.href = "/";
    });
};
