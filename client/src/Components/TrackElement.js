import React from "react";
import spotifyLogo from "../Assets/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Green.png";
import "./TrackElement.css";
import { FaExternalLinkAlt } from "react-icons/fa";

const TrackElement = ({ id, src, trackName, artist }) => {
  const spotifyUrl = `https://open.spotify.com/track/${id}`;
  return (
    <tr className="tracks-row">
      <td className="art-cell">
        <img className="album-art" id={id} src={src} alt="Album art of this track" />
        <a className="spotify-btn" href={spotifyUrl} target="_blank" rel="noopener noreferrer">
          <div className="spotify-btn-div">
            <img src={spotifyLogo} id={id} alt="Spotify Logo" className="spotify-logo" />
            <FaExternalLinkAlt id={id} className="fa-link-ext" />
          </div>
        </a>
      </td>
      <td id={id}>{trackName}</td>
      <td id={id}>{artist}</td>
    </tr>
  );
};

export default TrackElement;
