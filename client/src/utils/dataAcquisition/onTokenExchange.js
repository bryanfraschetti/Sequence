import { tokenTimeValidity } from "../tokenHandling/tokenTimeValidity";
import { refreshTokens } from "../tokenHandling/refreshTokens";
import { refreshPlaylists } from "./refreshPlaylists";

const empty_state_srcs = [
  "/public/images/recordPlayer.png",
  "/public/images/phonogram.png",
  "/public/images/recordNotes.png",
];

//tokens have successfully been agreed upon with Sequence
export const onTokenExchange = async () => {
  const access_token = localStorage.getItem("access_token");
  const tokensExpired = tokenTimeValidity();

  if (tokensExpired) {
    await refreshTokens();
  }

  fetch("https://api.spotify.com/v1/me", {
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
      localStorage.setItem("userId", response.id);
    })
    .catch((error) => {
      window.location.href = "/";
    });

  await refreshPlaylists();

  const tracks_table = document.getElementById("tracks-table");
  let tr = document.createElement("tr");
  tracks_table.appendChild(tr);

  let img = document.createElement("img");
  img.classList.add("tableimg");
  img.id = "tableimg";
  img.src = empty_state_srcs[Math.floor(Math.random() * 3)];
  tr.appendChild(img);

  let node = document.createElement("tr");
  node.id = "gentext"; //first row
  node.classList.add("gentext");
  node.innerHTML = "This area will populate with songs once you select a playlist.";
  tracks_table.appendChild(node); //add to tracks table
};
