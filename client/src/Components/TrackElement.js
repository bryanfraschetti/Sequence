import React from "react";

const TrackElement = ({ id, src, trackName, artist }) => {
  return (
    <tr className="tracks-row">
      <td>
        <img className="album-art" id={id} src={src} alt="Album art of this track" />
      </td>
      <td id={id}>{trackName}</td>
      <td id={id}>{artist}</td>
    </tr>
  );
};

export default TrackElement;
