import React from "react";

const PlsSeqNotice = () => {
  const goBack = () => {
    const errorNotice = document.getElementById("pls-seq-notice");
    errorNotice.style.display = "none";
    // window.location.href = "/";
  };

  return (
    <div
      id="pls-seq-notice"
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
        <p style={{ fontSize: "16px", margin: "0" }}>
          Choose a Sequencing algorithm and song to reorder the playlist. Once
          Sequenced, playlist will export
        </p>
        <button
          className="mybtn"
          style={{ width: "200px", color: "white", marginTop: "2rem" }}
          onClick={goBack}
        >
          Okay! I will.
        </button>
      </div>
    </div>
  );
};

export default PlsSeqNotice;
