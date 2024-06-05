import { renderToString } from "react-dom/server";
import TrackElement from "../../Components/TrackElement";
import { tupleToKey } from "../math/tupleToKey";

export const addTrackToDom = async (trackInfo) => {
  // Track Information
  const trackId = trackInfo.trackId;
  const trackName = trackInfo.name;
  const albumArtSrc = trackInfo.albumArtSrc;
  const artist = trackInfo.artist;
  const startSignature = tupleToKey(trackInfo.startkey, trackInfo.startmode);
  const startTempo = Math.round(trackInfo.starttempo);
  const endSignature = tupleToKey(trackInfo.endkey, trackInfo.endmode);
  const endTempo = Math.round(trackInfo.endtempo);

  // Create React Element Server Side
  const trackElementString = renderToString(
    <TrackElement
      id={trackId}
      src={albumArtSrc}
      trackName={trackName}
      artist={artist}
      startSignature={startSignature}
      startTempo={startTempo}
      endSignature={endSignature}
      endTempo={endTempo}
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
