export const addTrackToDom = (el) => {
  const tracksTable = document.getElementById("tracks-table");

  const track_id = el.track.id; //set track id

  const nodetr = document.createElement("tr"); //for each song create a new row
  nodetr.classList.add("tracks-row");

  const nodetd = document.createElement("td");
  const nodepic = document.createElement("img");
  nodepic.src = el.track.album.images[0].url; //source the album art
  nodepic.id = track_id;
  nodepic.className = "album-art";
  nodetd.appendChild(nodepic);
  nodetr.appendChild(nodetd);

  const nodetdtrack = document.createElement("td");
  nodetdtrack.id = track_id; //id is track id
  nodetdtrack.innerHTML = el.track.name;
  nodetr.appendChild(nodetdtrack);

  const nodetdartist = document.createElement("td");
  nodetdartist.id = track_id; //cell id is track id
  nodetdartist.innerHTML = el.track.artists[0].name; //innerhtml is main artist name
  nodetr.appendChild(nodetdartist);

  tracksTable.appendChild(nodetr);
};
