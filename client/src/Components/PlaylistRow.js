import React from "react";

const PlaylistRow = ({ id, src, titleText }) => {
  return (
    <li id={id}>
      <img
        className="coverimg"
        src={src}
        alt={`Playlist artwork for ${titleText}`}
      />
      <p className="playlist-title" id={id}>
        {titleText}
      </p>
    </li>
  );
};

export default PlaylistRow;
