import React, { useEffect } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import LoadingAnimation from "../Components/LoadingAnimation";
import { Exchange } from "../utils/tokenHandling/Exchange";
import { addScrollListener } from "../utils/styling/addScrollListener";
import "./SequencerPage.css";
import { playlistSelectionListener } from "../utils/selectionListeners/playlistSelectionListener";
import { trackSelectionListener } from "../utils/selectionListeners/trackSelectionListener";
import { ResizeAnimationStopper } from "../utils/styling/ResizeAnimationStopper";
import { sequencingModeListener } from "../utils/selectionListeners/sequencingModeListener";
import LogOut from "../Components/LogOut";
import ErrorNotice from "../Components/ErrorNotice";
import NotLoggedIn from "../Components/NotLoggedIn";
import Sidebar from "../Components/Sidebar";
import Tracks from "../Components/Tracks";
import Error429 from "../Components/Error429";

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
      <Error429></Error429>
      <ErrorNotice></ErrorNotice>
      <LogOut></LogOut>
      <NotLoggedIn></NotLoggedIn>
      <NavBar></NavBar>
      <div className="wrapper">
        <Sidebar></Sidebar>
        <Tracks></Tracks>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default SequencerPage;
