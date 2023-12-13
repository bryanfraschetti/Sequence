import React, { useEffect } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import LoadingAnimation from "./LoadingAnimation";
import { toggleSidebar } from "../utils/styling/toggleSidebar";
import { Exchange } from "../utils/tokenHandling/Exchange";
import { refreshPlaylists } from "../utils/dataAcquisition/refreshPlaylists";
import { addScrollListener } from "../utils/styling/addScrollListener";
import "./Home.css";
import EmptyStateArt from "../Components/EmptyStateArt";
import { playlistSelectionListener } from "../utils/selectionListeners/playlistSelectionListener";

const Home = () => {
  useEffect(() => {
    Exchange(); //onload ensure Sequence, client, and Spotify agree on credentials
    addScrollListener(document.getElementById("playlist-list")); //add event listeners that do scroll styling
    addScrollListener(document.getElementById("tracks"));
    playlistSelectionListener();
  }, []);

  let resizeTimer;
  window.addEventListener("resize", () => {
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("resize-animation-stopper");
    }, 400);
  });

  return (
    <div>
      <LoadingAnimation></LoadingAnimation>
      <NavBar></NavBar>
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
          <EmptyStateArt
            innerHTML={"This area will populate with songs once you select a playlist."}
          ></EmptyStateArt>
          <table className="tracks-table" id="tracks-table"></table>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Home;
