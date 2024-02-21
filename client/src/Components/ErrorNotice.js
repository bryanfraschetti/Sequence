import React from "react";

const ErrorNotice = () => {
  const goHome = () => {
    const errorNotice = document.getElementById("error-notice");
    errorNotice.style.display = "none";
    // window.location.href = "/";
  };

  return (
    <div
      id="error-notice"
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
      <div className="container" style={{ height: "220px" }}>
        <p style={{ fontSize: "18px", margin: "0" }}>Sorry, we've encountered an error!</p>
        <button
          className="mybtn"
          style={{ width: "200px", color: "white", marginTop: "2rem" }}
          onClick={goHome}
        >
          Okay! Go back home.
        </button>
      </div>
    </div>
  );
};

export default ErrorNotice;
