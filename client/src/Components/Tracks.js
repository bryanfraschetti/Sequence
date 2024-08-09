import React from "react";
import SequenceModeButton from "../Components/SequenceModeButton";
import EmptyStateArt from "../Components/EmptyStateArt";
import Hamburger from "../Components/Hamburger";
import "./Tracks.css";

const Tracks = () => {
  return (
    <div className="tracks" id="tracks">
      <Hamburger></Hamburger>
      <div className="sequencer" id="sequencer">
        <h3 className="subheading">Choose Sequencing</h3>
        <div className="button-container" id="button-container">
          <SequenceModeButton
            id="cof"
            text="Circle of Fifths"
          ></SequenceModeButton>
          <SequenceModeButton
            id="rsm"
            text="Rising Semitone Modal"
          ></SequenceModeButton>
          <SequenceModeButton
            id="dsm"
            text="Descending Semitone Modal"
          ></SequenceModeButton>
          <SequenceModeButton
            id="rsa"
            text="Rising Semitone Alternate"
          ></SequenceModeButton>
          <SequenceModeButton id="fader" text="Fader"></SequenceModeButton>
          <SequenceModeButton id="timbre" text="Timbre"></SequenceModeButton>
          <SequenceModeButton
            id="wt"
            text="Weighted Timbre"
          ></SequenceModeButton>
          <SequenceModeButton id="tt" text="Tempo Timbre"></SequenceModeButton>
        </div>
        <hr className="separator" id="seq-track-sep" />
      </div>
      <h3 className="subheading" id="tracklist-heading">
        Playlist Tracks
      </h3>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        <div id="spotify-ext" style={{ width: "160px" }}></div>
        <div id="export-ext"></div>
      </div>
      <EmptyStateArt
        innerHTML={
          "This area will populate with songs once you select a playlist."
        }
      ></EmptyStateArt>
      <table className="tracks-table" id="tracks-table"></table>
    </div>
  );
};

export default Tracks;
