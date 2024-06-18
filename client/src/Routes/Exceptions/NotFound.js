// NotFound.js

import React from "react";
import CanvasLightning from "./CanvasLightning";
import "./NotFound.css";
import "../../index.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <CanvasLightning />
      <div id="http-error-text">
        <h1 className="gradientText error-code">404</h1>
        <p className="error-body" style={{ marginBottom: "30px" }}>
          The beat storms on 🎶🌩️... Unfortunately, this endpoint doesn't.
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

export default NotFound;
