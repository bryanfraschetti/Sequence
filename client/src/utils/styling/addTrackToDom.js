import { renderToString } from "react-dom/server";
import TrackElement from "../../Components/TrackElement";

export const addTrackToDom = async (trackInfo) => {
  // Track Information
  const trackId = trackInfo.trackId;
  const trackName = trackInfo.name;
  const albumArtSrc = trackInfo.albumArtSrc;
  const artist = trackInfo.artist;

  // Create React Element Server Side
  const trackElementString = renderToString(
    <TrackElement
      id={trackId}
      src={albumArtSrc}
      trackName={trackName}
      artist={artist}
    />
  );

  // Inject Rendered Element into DOM
  const tempContainer = document.createElement("tbody");
  tempContainer.innerHTML = trackElementString;
  const tracksBody = document.getElementById("tracks-body");
  while (tempContainer.firstChild) {
    tracksBody.appendChild(tempContainer.firstChild);
  }
};
