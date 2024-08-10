import sequenceLogo from "../../Assets/sequence.png";
import PlaylistRow from "../../Components/PlaylistRow";
import { renderToString } from "react-dom/server";

export const addPlaylistToDom = (playlistInfo) => {
  // Playlist Info
  //   console.log(playlistInfo);
  const playlistId = playlistInfo.id;
  const coverArtSrc =
    playlistInfo.images.slice(-1)[0].url !== "null"
      ? playlistInfo.images.slice(-1)[0].url
      : sequenceLogo;
  const titleText = playlistInfo.name;
  //   console.log(typeof coverArtSrc);

  // Create React Element Server Side
  const playlistElementString = renderToString(
    <PlaylistRow id={playlistId} src={coverArtSrc} titleText={titleText} />
  );

  // Inject Rendered Element into DOM
  const tempContainer = document.createElement("div");
  tempContainer.innerHTML = playlistElementString;
  const playlistList = document.getElementById("playlist-list");
  while (tempContainer.firstChild) {
    playlistList.appendChild(tempContainer.firstChild);
  }
};
