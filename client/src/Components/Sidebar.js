import React from "react";
import { getPlaylistsSpotify } from "../utils/accessSpotify/getPlaylistsSpotify";
import "./Sidebar.css";
import { updatePlaylistCache } from "../utils/updateCache/updatePlaylistCache";
import { SequenceNamespace } from "../utils/SequenceNamespace";

const Sidebar = () => {
  const ForcePlaylistRefresh = async () => {
    await getPlaylistsSpotify();
    await updatePlaylistCache(SequenceNamespace.getVar("playlistList"));
  };
  return (
    <nav id="sidebar" className="">
      <div className="sidebar-header">
        <h3 className="subheading">Playlists</h3>
      </div>
      <button className="mybtn" onClick={ForcePlaylistRefresh}>
        Refresh Playlists
      </button>
      <ul className="playlists" id="playlist-list"></ul>
    </nav>
  );
};

export default Sidebar;
