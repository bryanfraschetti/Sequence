import TableHeader from "../../Components/TableHeader";
import { renderToString } from "react-dom/server";
import { SequenceNamespace } from "../SequenceNamespace";
import OpenSpotifyBtn from "../../Components/OpenSpotifyBtn";
import ExportBtn from "../../Components/ExportBtn";

export const InitializeTrackTable = () => {
  const playlistId = SequenceNamespace.getVar("playlistId");
  const spotifyUrl = `https://open.spotify.com/playlist/${playlistId}`;

  const OpenSpotifyBtnStr = renderToString(
    <OpenSpotifyBtn spotifyUrl={spotifyUrl} />
  );
  const tempBtnContainer = document.createElement("div");
  tempBtnContainer.innerHTML = OpenSpotifyBtnStr;

  const spotifyContainer = document.getElementById("spotify-ext");
  while (tempBtnContainer.firstChild) {
    spotifyContainer.appendChild(tempBtnContainer.firstChild);
  }

  const ExportBtnStr = renderToString(<ExportBtn />);
  const tempExportBtnContainer = document.createElement("button");
  tempExportBtnContainer.innerHTML = ExportBtnStr;

  const ExportBtnContainer = document.getElementById("export-ext");
  while (tempExportBtnContainer.firstChild) {
    ExportBtnContainer.appendChild(tempExportBtnContainer.firstChild);
  }

  // Render initialized element
  const initTable = renderToString(<TableHeader />);
  const tempContainer = document.createElement("table");
  tempContainer.innerHTML = initTable;

  // Inject into DOM
  const tracksTable = document.getElementById("tracks-table");
  while (tempContainer.firstChild) {
    tracksTable.appendChild(tempContainer.firstChild);
  }

  // Create tbody element in DOM
  const tracksBody = document.createElement("tbody");
  tracksBody.id = "tracks-body";
  tracksTable.appendChild(tracksBody);
};
