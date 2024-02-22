import phonogram from "../../Assets/EmptyStateArt/phonogram.png";
import PlaylistRow from "../../Components/PlaylistRow";
import { renderToString } from "react-dom/server";

export const addPlaylistToDom = (playlistInfo) => {
  // Playlist Info
  const playlistId = playlistInfo.id;
  const coverArtSrc =
    playlistInfo.images.length !== 0 ? playlistInfo.images.slice(-1)[0].url : phonogram;
  const titleText = playlistInfo.name;

  // Create React Element Server Side
  const playlistElementString = renderToString(
    <PlaylistRow id={playlistId} src={coverArtSrc} titleText={titleText} />
  );

  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = playlistElementString;
  const playlistList = document.getElementById("playlist-list");
  while (tempContainer.firstChild) {
    playlistList.appendChild(tempContainer.firstChild);
  }
};
