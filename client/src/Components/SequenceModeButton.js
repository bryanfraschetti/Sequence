import React from "react";

const SequenceModeButton = ({ id, text }) => {
  return (
    <span className="seq-wrapper-inactive">
      <span className="sequencer-buttons inactive-sequencer" id={id}>
        {text}
      </span>
    </span>
  );
};

export default SequenceModeButton;
