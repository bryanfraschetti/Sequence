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
    <tr className="tracks-row">
      <td className="art-cell">
        <div
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
            <p className="trackname">{trackName}</p>
            <p className="artistname">{artist}</p>
          </div>
        </div>
      </td>
      <td id={id}>{startSignature}</td>
      <td id={id}>{startTempo}</td>
      <td id={id}>{endSignature}</td>
      <td id={id}>{endTempo}</td>
    </tr>
  );
};

export default TrackElement;
