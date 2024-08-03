import React from "react";
import spotifyLogo from "../Assets/spotify-icons-logos/icons/01_RGB/02_PNG/Spotify_Icon_RGB_Green.png";

import "./OpenSpotifyBtn.css";
import { LuExternalLink } from "react-icons/lu";

const OpenSpotifyBtn = ({ spotifyUrl }) => {
  return (
    <a
      className="spotify-btn"
      href={spotifyUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="spotify-btn-div">
        <img src={spotifyLogo} alt="Spotify Logo" className="spotify-logo" />
        <p style={{ marginLeft: "10px", marginRight: "4px" }}>Open Spotify</p>
        <LuExternalLink size={16}></LuExternalLink>
      </div>
    </a>
  );
};

export default OpenSpotifyBtn;
