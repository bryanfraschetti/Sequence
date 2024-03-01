import React from "react";
import "./LoadingAnimation.css";
/* The following loading animation is a variation of the codepen: https://codepen.io/yomateo/pen/ypbNrJ */

const LoadingAnimation = () => {
  return (
    <div
      id="loading-container"
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        height: "100vh",
        width: "100vw",
        zIndex: "9999",
        background: "rgba(20, 20, 30, 0.3)",
        textAlign: "center",
        display: "none",
      }}
    >
      <div className="container">
        <p style={{ fontSize: "18px", margin: "0" }}>Fetching Data...</p>
        <div
          className="boxContainer"
          copyright="Copyright (c) 2022 by Lasse Diercks (https://codepen.io/lassediercks/pen/QOrzgG)"
        >
          <div className="box box1"></div>
          <div className="box box2"></div>
          <div className="box box3"></div>
          <div className="box box4"></div>
          <div className="box box5"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingAnimation;
