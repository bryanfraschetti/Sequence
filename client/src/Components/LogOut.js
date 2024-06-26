import React from "react";
import { Unauthorize } from "../utils/tokenHandling/Unauthorize";

const LogOut = () => {
  const CancelLogout = () => {
    const logoutContainer = document.getElementById("log-out-container");
    logoutContainer.style.display = "none";
  };

  return (
    <div
      id="log-out-container"
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
      <div className="container" style={{ width: "250px" }}>
        <p style={{ fontSize: "18px", margin: "0" }}>
          Are you sure you want to log out?
        </p>
        <p style={{ textAlign: "left" }}>You can log back in at any time</p>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div
            className="btnEmptyWrapper"
            style={{ margin: "0px 10px 0px 0px" }}
          >
            <button
              className="myBtnEmpty"
              id="learnMore"
              onClick={Unauthorize}
              style={{ width: "100px", backgroundColor: "#1c1d25" }}
            >
              <p
                className="gradientText"
                style={{ margin: "0px", padding: "0px" }}
              >
                Yes
              </p>
            </button>
          </div>
          <button
            className="myBtn"
            style={{ borderRadius: "12px", padding: "8px 25px" }}
            onClick={CancelLogout}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogOut;
