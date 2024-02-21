import phonogram from "../../Assets/EmptyStateArt/phonogram.png";

export const addPlaylistToDom = (playlistInfo) => {
  const playlistList = document.getElementById("playlist-list");

  const node = document.createElement("li");
  node.id = playlistInfo.id; //li id = playlist id

  const playlistArt = document.createElement("img");
  if (playlistInfo.images.length !== 0) {
    playlistArt.src = playlistInfo.images.slice(-1)[0].url; //src for img
  } else {
    playlistArt.src = phonogram;
  }
  playlistArt.className = "coverimg";
  node.appendChild(playlistArt); //append img to li

  const playlistTitleElement = document.createElement("p");
  playlistTitleElement.className = "playlist-title";
  playlistTitleElement.id = playlistInfo.id;
  playlistTitleElement.innerHTML = playlistInfo.name;
  node.appendChild(playlistTitleElement); //append p to li

  playlistList.appendChild(node); //append li to ul
};
