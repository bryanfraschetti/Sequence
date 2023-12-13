export const InitializeTrackTable = () => {
  const tracksTable = document.getElementById("tracks-table");

  const node = document.createElement("tr");
  tracksTable.appendChild(node); //add to tracks table

  const nodealbumart = document.createElement("td"); //Album title header
  nodealbumart.innerHTML = "Album";
  nodealbumart.className = "tracks-table-header";
  node.appendChild(nodealbumart);

  const nodetitle = document.createElement("td"); //song title header
  nodetitle.innerHTML = "Song Title";
  nodetitle.className = "tracks-table-header";
  node.appendChild(nodetitle);

  const nodeartist = document.createElement("td"); //artist header
  nodeartist.innerHTML = "Artist";
  nodeartist.className = "tracks-table-header";
  node.appendChild(nodeartist);
};
