// BadGateway.js

import React from "react";
import CanvasLightning from "./CanvasLightning";
import "./BadGateway.css";
import "../../index.css";

const BadGateway = () => {
  return (
    <div className="not-found">
      <CanvasLightning />
      <div id="http-error-text">
        <h1 className="gradientText error-code">502</h1>
        <p className="error-body" style={{ marginBottom: "30px" }}>
          Apologies, Sequence received a bad response from an upstream server
          while acting as a gateway 💻➡️🖥️↩️⛔.
        </p>
        <div className="btnEmptyWrapper">
          <button
            className="myBtnEmpty"
            onClick={() => {
              window.location.href = "/";
            }}
            style={{ width: "fit-content" }}
          >
            <p className="gradientText" style={{ margin: "0px" }}>
              Take me home!
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BadGateway;
