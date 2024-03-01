import React from "react";
import { getPlaylistsSpotify } from "../utils/accessSpotify/getPlaylistsSpotify";
import "./Sidebar.css";

const Sidebar = () => {
  return (
    <nav id="sidebar" className="">
      <div className="sidebar-header">
        <h3 className="subheading">Playlists</h3>
      </div>
      <button className="mybtn" onClick={getPlaylistsSpotify}>
        Refresh Playlists
      </button>
      <ul className="playlists" id="playlist-list"></ul>
    </nav>
  );
};

export default Sidebar;
