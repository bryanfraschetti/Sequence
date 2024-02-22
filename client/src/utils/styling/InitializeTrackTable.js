import TableHeader from "../../Components/TableHeader";
import { renderToString } from "react-dom/server";

export const InitializeTrackTable = () => {
  const initTable = renderToString(<TableHeader />);
  const tempContainer = document.createElement("table");
  tempContainer.innerHTML = initTable;
  const tracksTable = document.getElementById("tracks-table");
  while (tempContainer.firstChild) {
    tracksTable.appendChild(tempContainer.firstChild);
  }

  const tracksBody = document.createElement("tbody");
  tracksBody.id = "tracks-body";
  tracksTable.appendChild(tracksBody);
};
