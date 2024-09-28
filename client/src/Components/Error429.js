import React from "react";

const Error429 = () => {
  const goBack = () => {
    const error429 = document.getElementById("error-429");
    error429.style.display = "none";
    // window.location.href = "/";
  };

  return (
    <div
      id="error-429"
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
        <p style={{ fontSize: "18px", margin: "0" }}>
          Unfortunately, we have reached the rate limit with Spotify. Please
          wait a few minutes before trying again
        </p>
        <button
          className="mybtn"
          style={{ width: "200px", color: "white", marginTop: "2rem" }}
          onClick={goBack}
        >
          Okay! Go back.
        </button>
      </div>
    </div>
  );
};

export default Error429;
