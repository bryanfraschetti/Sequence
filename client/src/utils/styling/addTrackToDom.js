import { renderToString } from "react-dom/server";
import TrackElement from "../../Components/TrackElement";

export const addTrackToDom = (trackInfo) => {
  // Track Information
  const trackId = trackInfo.track.id;
  const albumArtSrc = trackInfo.track.album.images[0].url;
  const trackName = trackInfo.track.name;
  const artist = trackInfo.track.artists[0].name;

  // Create React Element Server Side
  const trackElementString = renderToString(
    <TrackElement id={trackId} src={albumArtSrc} trackName={trackName} artist={artist} />
  );

  const tempContainer = document.createElement("tbody");
  tempContainer.innerHTML = trackElementString;
  const tracksBody = document.getElementById("tracks-body");
  while (tempContainer.firstChild) {
    tracksBody.appendChild(tempContainer.firstChild);
  }
};
