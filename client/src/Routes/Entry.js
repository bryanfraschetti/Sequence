import React from "react";
import { useEffect } from "react";
import NavBar from "../Components/NavBar";
import "./Entry.css";
import { Card } from "antd";
import AutoplayCarousel from "../Components/AutoplayCarousel";
import Footer from "../Components/Footer";
import SoundWave from "../Components/SoundWave";
import { ResizeAnimationStopper } from "../utils/styling/ResizeAnimationStopper";
import { requestAuthorization } from "../utils/tokenHandling/requestAuthorization";
import LogOut from "../Components/LogOut";
import { getUserInfo } from "../utils/dataAcquisition/getUserInfo";
import NotLoggedIn from "../Components/NotLoggedIn";
import ErrorNotice from "../Components/ErrorNotice";

const Entry = () => {
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      getUserInfo();
    }
    ResizeAnimationStopper();
  }, []);

  return (
    <div>
      <LogOut></LogOut>
      <NotLoggedIn></NotLoggedIn>
      <ErrorNotice></ErrorNotice>
      <NavBar></NavBar>
      <div className="entry postNav">
        <div
          className="summaryWrapper heroSection"
          // style={{
          //   background:
          //     "linear-gradient(150deg, rgb(255,111, 43), rgba(255, 165, 0, 0) 7%, rgba(255, 165, 0, 0) 93%, rgba(255, 90, 115, 1))",
          // }}
        >
          <div className="appSummary">
            <h3 className="appSummaryText myTitle">
              Sequence:
              <span
                className="accentText gradientText"
                style={{ fontSize: "1.9rem", textAlign: "center" }}
              >
                {" "}
                Redefine the way you listen.
              </span>
            </h3>

            <p
              className="appSummaryText bodyText subtleText"
              style={{ maxWidth: "500px" }}
            >
              Our innovative app, which we call <i>Sequence</i>,
              <span className="accentText gradientText"> harnesses </span>
              the power of the Spotify API to dynamically rearrange your
              playlists based on music theory and musical similarity. Whether
              you're a musician, music theory buff, or casual music enthusiast,
              you'll love our app. Start today and find
              <span className="accentText gradientText"> inspiration.</span>
            </p>

            <SoundWave></SoundWave>

            <div className="heroBtnContainer" style={{ marginTop: "0px" }}>
              <div className="btnEmptyWrapper">
                <button
                  className="myBtnEmpty"
                  id="learnMore"
                  onClick={() => {
                    window.location.href = "/about";
                  }}
                >
                  <p className="gradientText" style={{ margin: "0px" }}>
                    Learn More
                  </p>
                </button>
              </div>

              <button
                className="myBtn"
                id="startCTA"
                onClick={requestAuthorization}
              >
                Get Started!
              </button>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <h3
            className="appSummaryText myTitle"
            style={{ marginBottom: "20px" }}
          >
            Check out our Favourite Playlists:
          </h3>
          <div className="carouselTileContainer">
            <Card id="carouselTile">Our Favourite Playlists</Card>
            <AutoplayCarousel></AutoplayCarousel>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Entry;
