import React from "react";
// import spotifyLogo from "../Assets/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png";
import "./TrackElement.css";
// import { FaExternalLinkAlt } from "react-icons/fa";

const TrackElement = ({
  id,
  src,
  trackName,
  artist,
  startSignature,
  startTempo,
  endSignature,
  endTempo,
}) => {
  //   const spotifyUrl = `https://open.spotify.com/track/${id}`;
  return (
    <tr className="tracks-row" id={id}>
      <td className="art-cell" id={id}>
        <div
          id={id}
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            className="album-art"
            id={id}
            src={src}
            alt="Album art of this track"
          />
          {/* <a className="spotify-btn" href={spotifyUrl} target="_blank" rel="noopener noreferrer">
          <div className="spotify-btn-div">
            <img src={spotifyLogo} id={id} alt="Spotify Logo" className="spotify-logo" />
            <FaExternalLinkAlt id={id} className="fa-link-ext" />
          </div>
        </a> */}
          <div id={id} className="trackinfo">
            <p className="trackname" id={id}>
              {trackName}
            </p>
            <p className="artistname" id={id}>
              {artist}
            </p>
          </div>
        </div>
      </td>
      <td id={id} className="music-data">
        {startSignature}
      </td>
      <td id={id} className="music-data">
        {startTempo}
      </td>
      <td id={id} className="music-data">
        {endSignature}
      </td>
      <td id={id} className="music-data">
        {endTempo}
      </td>
    </tr>
  );
};

export default TrackElement;
