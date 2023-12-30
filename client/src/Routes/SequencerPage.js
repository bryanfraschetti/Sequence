import React, { useEffect } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import LoadingAnimation from "../Components/LoadingAnimation";
import { toggleSidebar } from "../utils/styling/toggleSidebar";
import { Exchange } from "../utils/tokenHandling/Exchange";
import { refreshPlaylists } from "../utils/dataAcquisition/refreshPlaylists";
import { addScrollListener } from "../utils/styling/addScrollListener";
import "./SequencerPage.css";
import EmptyStateArt from "../Components/EmptyStateArt";
import { playlistSelectionListener } from "../utils/selectionListeners/playlistSelectionListener";
import { trackSelectionListener } from "../utils/selectionListeners/trackSelectionListener";
import { ResizeAnimationStopper } from "../utils/styling/ResizeAnimationStopper";
import { sequencingModeListener } from "../utils/selectionListeners/sequencingModeListener";

const SequencerPage = () => {
  useEffect(() => {
    Exchange(); //onload ensure Sequence, client, and Spotify agree on credentials
    ResizeAnimationStopper();
    addScrollListener(document.getElementById("playlist-list")); //add event listeners that style scrolling
    addScrollListener(document.getElementById("tracks"));
    playlistSelectionListener(); //event listeners for user input
    trackSelectionListener();
    sequencingModeListener();
  }, []);

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
                <span className="sequencer-buttons inactive-sequencer" id="cof">
                  Circle of Fifths
                </span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer" id="rsm">
                  Rising Semitone Modal
                </span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer" id="dsm">
                  Descending Semitone Modal
                </span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer" id="rsa">
                  Rising Semitone Alternate
                </span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer" id="fader">
                  Fader
                </span>
              </span>
              <span className="seq-wrapper-inactive">
                <span className="sequencer-buttons inactive-sequencer" id="timbre">
                  Timbre
                </span>
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

export default SequencerPage;
