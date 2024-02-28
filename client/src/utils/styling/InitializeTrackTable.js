import TableHeader from "../../Components/TableHeader";
import { renderToString } from "react-dom/server";

export const InitializeTrackTable = () => {
  // Render initialized element server side
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
