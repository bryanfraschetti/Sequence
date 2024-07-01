import React, { useEffect } from "react";
import NavBar from "../Components/NavBar";
import { ResizeAnimationStopper } from "../utils/styling/ResizeAnimationStopper";
import LogOut from "../Components/LogOut";
import { getUserInfo } from "../utils/dataAcquisition/getUserInfo";
import NotLoggedIn from "../Components/NotLoggedIn";
import Footer from "../Components/Footer";
import "./Help.css";
import FaqItem from "../Components/FaqItem";
import { FaGears } from "react-icons/fa6";
import { IoPeople } from "react-icons/io5";
import { FaExchangeAlt, FaTools } from "react-icons/fa";
import { TfiThought } from "react-icons/tfi";
import { BiNotepad } from "react-icons/bi";
import { MdNewReleases, MdOutlineSecurityUpdateGood } from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";

const Help = () => {
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
      <NavBar></NavBar>
      <div className="postNav centerContent">
        <span className="FAQ-span" style={{ alignItems: "center" }}>
          <FaGears className="headerIcon" size={32} />
          <h2 className="myTitle" style={{ margin: "32px" }}>
            How to Use <span className="gradientText">Sequence</span>
          </h2>
        </span>

        <div
          style={{
            width: "100%",
          }}
        >
          <div className="banner" style={{ width: "100%", background: "" }}>
            <div className="instructionText">
              <h1>
                <span className="gradientText" style={{ fontWeight: "400" }}>
                  Get Started
                </span>
              </h1>
              <p className="bText">
                On the home page, click the get started button.
              </p>
            </div>
          </div>

          <div className="banner" style={{ width: "100%", background: "" }}>
            <div className="instructionText">
              <h1>
                <span className="gradientText" style={{ fontWeight: "400" }}>
                  Read and Accept the Terms of Service
                </span>
              </h1>
              <p className="bText">
                You will be prompted by Spotify to grant Sequence access to
                certain permissions. The details of each permission are outlined
                by Spotify before you accept/deny the conditions.
              </p>

              {/* <ul className="bText" style={{ listStyle: "none" }}>
                <li>View your Spotify account data</li>
                <li>View your Spotify playlists</li>
                <li>Create new resources (playlists) in Spotify</li>
            </ul> */}
            </div>
          </div>

          <div className="banner" style={{ width: "100%", background: "" }}>
            <div className="instructionText">
              <h1>
                <span className="gradientText" style={{ fontWeight: "400" }}>
                  Select a Playlist
                </span>
              </h1>
              <p className="bText">
                Select a playlist by clicking on it and choose a sequencing mode
                from the options. Select the song that you want to be the first
                in the new playlist. When you click on a song the playlist will
                automatically generate in Spotify, but may take a few seconds to
                appear within the app depending on when your app refreshes.
              </p>
            </div>
          </div>

          <div className="banner" style={{ width: "100%", background: "" }}>
            <div className="instructionText">
              <h1>
                <span className="gradientText" style={{ fontWeight: "400" }}>
                  Select a Song
                </span>
              </h1>
              <p className="bText">
                Select the song that you want to be the first in the new
                playlist. When you click on a song the playlist will
                automatically generate in Spotify, but may take a few seconds to
                appear within the app depending on when your app refreshes.
              </p>
            </div>
          </div>

          <div className="banner" style={{ width: "100%", background: "" }}>
            <div className="instructionText">
              <h1>
                <span className="gradientText" style={{ fontWeight: "400" }}>
                  Revoke Permissions
                </span>
              </h1>
              <p className="bText">
                At any time you can revoke Sequence's access permissions by
                clicking on your avatar and selecting "Log out", or from within
                Spotify using their "Manage Apps Page."
              </p>
            </div>
          </div>
        </div>
        <h2 className="myTitle">FAQs</h2>
        <div className="FAQ-container">
          <span className="FAQ-span">
            <TfiThought className="FAQ-icon" size={25} />
            <FaqItem title="What is Sequence" id="FaqCard1">
              <p>
                Sequence is a web application that leverages the Spotify API to
                analyze the musical content of songs in a playlist and optimally
                sort the playlist by matching key signatures and timbres while
                synchronizing tempos. The ultimate result is a playlist with
                seemless crossfading between songs.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <IoPeople className="FAQ-icon" size={25} />
            <FaqItem title="Who is Sequence for" id="FaqCard2">
              <p>
                Sequence is intended for everyone. Casual listeners can improve
                the flow of their playlist while Artists/DJs can be inspired by
                the transitions and flows of playlists to create something new.
                The app is intentionally designed to be minimalistic and
                accessible for all users, independent of their music knowledge.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <FaExchangeAlt className="FAQ-icon" size={25} />
            <FaqItem title="Are Playlists Altered" id="FaqCard3">
              <p>
                No, existing playlists are not altered, nor directly interacted
                with. When you sequence a playlist a new one will be created in
                Spotify. The name will combine the chosen sequencing mode with
                the original playlist title, and the playlist cover image will
                be our logo. The original playlist remains untouched.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <MdOutlineSecurityUpdateGood className="FAQ-icon" size={25} />
            <FaqItem title="How is my Data Used" id="FaqCard5">
              <p>
                Sequence only accesses data necessary to perform the task of
                sorting your playlists. This requires your user data, through
                which we can read your public, private, and followed playlists
                as well as create new playlists.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <FaTools className="FAQ-icon" size={25} />
            <FaqItem title="How is Sequence Built" id="FaqCard4">
              <p>
                Sequence was built by coupling a ReactJS component oriented
                front-end (streamlined using AntDesign) with a NodeJS/ExpressJS
                back-end. Authorization and authentication related requests are
                proxied to Spotify via Express and caching occurs server-side
                using a Redis client. The Node app and Redis client run in
                separate Docker containers that communicate with each other over
                a Docker network.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <MdNewReleases className="FAQ-icon" size={25} />
            <FaqItem title="I am Receiving Errors" id="FaqCard6">
              <p>
                If you are repeatedly receiving errors, first try refreshing the
                page. If this does not work, try logging out and then back in as
                this will clear all client and server side cache. Feel free to
                reach out and provide us information about the errors.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <TbRulerMeasure className="FAQ-icon" size={25} />
            <FaqItem title="New Playlist is Shorter" id="FaqCard7">
              <p>
                Currently, Sequence only supports playlists of 50 songs to
                minimize the computational burden on the Spotify API and reduce
                the risk of surpassing its rate-limit, which would cause a
                service interruption for all users. If a playlist has more than
                50 songs, it will unfortunately be truncated.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <BiNotepad className="FAQ-icon" size={25} />
            <FaqItem title="Have a Suggestion?" id="FaqCard8">
              <p>
                If you have any suggestions, ideas for new features, notice any
                glitches, or want to get involved in the project, feel free to
                contact us using any of the social media links in the Footer
              </p>
            </FaqItem>
          </span>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default Help;
