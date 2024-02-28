import React from "react";

const NotLoggedIn = () => {
  const CloseAlert = () => {
    const logoutContainer = document.getElementById("not-logged-in");
    logoutContainer.style.display = "none";
    window.location.href = "/";
  };

  return (
    <div
      id="not-logged-in"
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
      <div className="container" style={{ width: "225px", height: "175px" }}>
        <p style={{ fontSize: "18px", margin: "0" }}>You are not logged in</p>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <button
            className="myBtn"
            style={{ borderRadius: "12px", padding: "8px 25px" }}
            onClick={CloseAlert}
          >
            Okay, Close!
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotLoggedIn;
