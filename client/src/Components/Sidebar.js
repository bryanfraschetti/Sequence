import React from "react";
import "./Sidebar.css";
import "../index.css";

const Sidebar = () => {
  return (
    <div className="Sidebar">
      <div className="sidebarPreface">
        <h3 className="sidebarTitle">Playlists</h3>
        <button className="myBtn" id="refreshPlaylistsBtn">
          Refresh Playlists
        </button>
      </div>
      <ul className="playlistList"></ul>
    </div>
  );
};

export default Sidebar;
