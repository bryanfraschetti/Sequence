import React from "react";
import "./EmptyStateArt.css";

const EmptyStateArt = ({ innerHTML }) => {
  const emptyStateSrcs = [
    "/public/images/recordPlayer.png",
    "/public/images/phonogram.png",
    "/public/images/recordNotes.png",
  ];

  const randomSelection = emptyStateSrcs[Math.floor(Math.random() * 3)];

  return (
    <div id="EmptyStateContainer">
      <img
        src={randomSelection}
        id="EmptyStateArt"
        alt="placeholder art to represent empty state"
      ></img>
      <p id="EmptyStateText">{innerHTML}</p>
    </div>
  );
};

export default EmptyStateArt;
