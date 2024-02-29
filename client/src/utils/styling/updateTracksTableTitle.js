import { removeAllChildren } from "../styling/removeAllChildren";

export const updateTracksTableTitle = (playlistName) => {
  removeAllChildren("tracks-table"); // Clear any existing tracks
  const tracksHeader = document.getElementById("tracklist-heading");
  tracksHeader.innerHTML = `"${playlistName}" Tracklist`; // Reflect selected playlist
};
