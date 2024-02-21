import React from "react";
import "./EmptyStateArt.css";
import phonogram from "../Assets/EmptyStateArt/phonogram.png";
import recordNotes from "../Assets/EmptyStateArt/recordNotes.png";
import recordPlayer from "../Assets/EmptyStateArt/recordPlayer.png";

const EmptyStateArt = ({ innerHTML }) => {
  const emptyStateSrcs = [phonogram, recordNotes, recordPlayer];
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
