import React, { useEffect } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import LoadingAnimation from "../Components/LoadingAnimation";
import { toggleSidebar } from "../utils/styling/toggleSidebar";
import { Exchange } from "../utils/tokenHandling/Exchange";
import { getPlaylistsSpotify } from "../utils/acessSpotify/getPlaylistsSpotify";
import { addScrollListener } from "../utils/styling/addScrollListener";
import "./SequencerPage.css";
import EmptyStateArt from "../Components/EmptyStateArt";
import { playlistSelectionListener } from "../utils/selectionListeners/playlistSelectionListener";
import { trackSelectionListener } from "../utils/selectionListeners/trackSelectionListener";
import { ResizeAnimationStopper } from "../utils/styling/ResizeAnimationStopper";
import { sequencingModeListener } from "../utils/selectionListeners/sequencingModeListener";
import LogOut from "../Components/LogOut";
import ErrorNotice from "../Components/ErrorNotice";
import NotLoggedIn from "../Components/NotLoggedIn";
import SequenceModeButton from "../Components/SequenceModeButton";

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
      <ErrorNotice></ErrorNotice>
      <LogOut></LogOut>
      <NotLoggedIn></NotLoggedIn>
      <NavBar></NavBar>
      <div className="wrapper">
        <nav id="sidebar" className="">
          <div className="sidebar-header">
            <h3 className="subheading">Playlists</h3>
          </div>
          <button className="mybtn" onClick={getPlaylistsSpotify}>
            Refresh Playlists
          </button>
          <ul className="playlists" id="playlist-list"></ul>
        </nav>
        <div className="tracks" id="tracks">
          <button
            className="show-hide active"
            id="sidebarCollapse"
            onClick={toggleSidebar}
          >
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
              <SequenceModeButton
                id="cof"
                text="Circle of Fifths"
              ></SequenceModeButton>
              <SequenceModeButton
                id="rsm"
                text="Rising Semitone Modal"
              ></SequenceModeButton>
              <SequenceModeButton
                id="dsm"
                text="Descending Semitone Modal"
              ></SequenceModeButton>
              <SequenceModeButton
                id="rsa"
                text="Rising Semitone Alternate"
              ></SequenceModeButton>
              <SequenceModeButton id="fader" text="Fader"></SequenceModeButton>
              <SequenceModeButton
                id="timbre"
                text="Timbre"
              ></SequenceModeButton>
            </div>
            <hr className="separator" id="seq-track-sep" />
          </div>
          <h3 className="subheading" id="tracklist-heading">
            Playlist Tracklist
          </h3>
          <EmptyStateArt
            innerHTML={
              "This area will populate with songs once you select a playlist."
            }
          ></EmptyStateArt>
          <table className="tracks-table" id="tracks-table"></table>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default SequencerPage;
