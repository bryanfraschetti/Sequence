import React from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import "./Home.css";

const Home = () => {
  //remove animation for window resizing
  let resizeTimer;
  window.addEventListener("resize", () => {
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("resize-animation-stopper");
    }, 400);
  });

  function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("inactive");
    document.getElementById("tracks").classList.toggle("inactive");
    document.getElementById("sidebarCollapse").classList.toggle("active");
    document.getElementById("left-arrow").classList.toggle("active");
    document.getElementById("right-arrow").classList.toggle("active");
  }

  function refreshPlaylists() {
    console.log("refresh request");
  }

  return (
    <div>
      <NavBar></NavBar>
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
      <div className="wrapper">
        <nav id="sidebar" className="">
          <div className="sidebar-header">
            <h3 className="subheading">Playlists</h3>
          </div>
          <button className="mybtn" onClick={refreshPlaylists}>
            Refresh Playlists
          </button>
          <ul className="playlists" id="playlist-list"></ul>
        </nav>
        <div className="tracks" id="tracks">
          <button className="show-hide active" id="sidebarCollapse" onClick={toggleSidebar}>
            <span className="arrow active" id="left-arrow">
              ◂
            </span>
            <span className="arrow" id="right-arrow">
              ▸
            </span>
          </button>
          <div className="sequencer" id="sequencer">
            <h3 className="subheading">Choose Sequencing</h3>
            <div className="button-container" id="button-container">
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer">Circle of Fifths</span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer">Rising Semitone Modal</span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer">
                  Descending Semitone Modal
                </span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer">
                  Rising Semitone Alternate
                </span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer">Fader</span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer">Timbre</span>
              </span>
            </div>
            <hr className="separator" id="seq-track-sep" />
          </div>
          <h3 className="subheading" id="tracklist-heading">
            Playlist Tracklist
          </h3>
          <table className="tracks-table" id="tracks-table"></table>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Home;
