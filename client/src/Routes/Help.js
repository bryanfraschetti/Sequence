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
import {
  IoPeople,
  IoDocumentTextOutline,
  IoPersonRemoveOutline,
} from "react-icons/io5";
import { IoMdCloudUpload } from "react-icons/io";
import { FaExchangeAlt, FaTools } from "react-icons/fa";
import { TfiThought } from "react-icons/tfi";
import { BiNotepad } from "react-icons/bi";
import {
  MdNewReleases,
  MdOutlineSecurityUpdateGood,
  MdOutlineNotStarted,
} from "react-icons/md";
import { TbRulerMeasure } from "react-icons/tb";
import { HiCursorClick } from "react-icons/hi";
import { GiCardPick } from "react-icons/gi";
import { TbReorder } from "react-icons/tb";
import RevealComponent from "../Components/revealComponent";

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
          <TbReorder className="headerIcon" size={32} />
          <h2 className="myTitle" style={{ margin: "20px" }}>
            <span className="gradientText">Sequencing</span> Modes Explained
          </h2>
        </span>

        <p
          className="bText"
          style={{ width: "min(100%, 800px)", textAlign: "center" }}
        >
          Sequence offers many algorithms which can organize your playlists -
          each provides its own unique flavour and quality. Click on any
          algorithm name below to learn more. Different algorithms will work
          better with different genres. Experiment with the pairing and initial
          song!
        </p>

        <div className="FAQ-container">
          <span className="FAQ-span">
            <FaqItem title="Soothing" id="soothing">
              <p>
                The soothing sorting algorithm is based on the idea of musical
                resolution. The goal of this sorting pattern is to provide the
                most neutral and relaxing transitions by basing the sequence on
                harmonics. Functionally speaking, this algorithm sorts playlists
                by resolving counter-clockwise about the circle of fifths while
                tempo matching.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <FaqItem title="Cross-Fading" id="cross-fading">
              <p>
                The Cross-Fading algorithm is based on key-matching transitions.
                It is designed to preferentially create transitions that match
                the ending key signature of one song to the starting key of
                another while synchronizing tempos for the most seamless and
                energetic of transitions.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <FaqItem title="Rising and Falling" id="rising-falling">
              <p>
                The Rising and Falling sorting algorithms are designed upon the
                same principle - just operating in opposite directions. The
                Rising algorithm sorts by pairing songs such that the key
                signature ascend one semitone at a time, song over song. The
                falling sort descends one semitone at a time. Both of these
                sequences embed fundamentally embed tension into the transitions
                by exploiting the adjacency of the harmonics.
              </p>
            </FaqItem>
          </span>
          <span className="FAQ-span">
            <FaqItem title="Timbre" id="timbre">
              <p>
                Perhaps the most interesting and conceptual algorithm is the
                Timbre algorithm. Spotify conducted analysis (via PCA) of their
                song database to determine the frequency-time audio features
                (spectrotemporal surfaces) that maximize the representation the
                audio space. These features correspond to qualities such as
                "brightness," "flatness," "attack," etc. and characterize the
                perceived the sound. Using these descriptors, the distance
                between songs can be determined. This algorithm preferential
                sorts by finding the nearest song in the feature space and
                produces a seamlessly flowing playlist.
              </p>
            </FaqItem>
          </span>

          <span className="FAQ-span">
            <FaqItem title="Tempo Timbre" id="tempotimbre">
              <p>
                The Tempo Timbre algorithm works on the same principle as the
                Timbre algorithm, but with a strong focus on aligning songs with
                similar tempos. This helps ensure that the transitions between
                songs don't clash due to offset and out-of-phase beats.
              </p>
            </FaqItem>
          </span>

          <span className="FAQ-span">
            <FaqItem title="Angular" id="angular">
              <p>
                The Angular algorithm sorts based on the same spectrotemporal
                features as the timbre algorithms, however, instead of sorting
                by finding the songs that are closest to each other, it sorts by
                finding the songs which point in the most similar directions.
                The effect of which is consecutive songs will have demonstrate a
                similar combination of features and quality, but taken to
                varying extremes.
              </p>
            </FaqItem>
          </span>
        </div>

        <span className="FAQ-span" style={{ alignItems: "center" }}>
          <FaGears className="headerIcon" size={32} />
          <h2 className="myTitle" style={{ margin: "20px" }}>
            How to Use <span className="gradientText">Sequence</span>
          </h2>
        </span>

        <div
          style={{
            width: "100%",
          }}
        >
          <RevealComponent>
            <div className="banner" style={{ width: "100%", background: "" }}>
              <div className="instructionText">
                <h1>
                  <span className="gradientText" style={{ fontWeight: "400" }}>
                    <MdOutlineNotStarted className="instruction-icon"></MdOutlineNotStarted>
                    Get Started
                  </span>
                </h1>
                <p className="bText">
                  On the home page, click the get started button.
                </p>
              </div>
            </div>
          </RevealComponent>

          <RevealComponent>
            <div className="banner" style={{ width: "100%", background: "" }}>
              <div className="instructionText">
                <h1>
                  <span className="gradientText" style={{ fontWeight: "400" }}>
                    <IoDocumentTextOutline className="instruction-icon"></IoDocumentTextOutline>
                    Read and Accept the Terms of Service
                  </span>
                </h1>
                <p className="bText">
                  You will be prompted by Spotify to grant Sequence access to
                  certain permissions. The details of each permission are
                  outlined by Spotify before you accept/deny the conditions.
                </p>
              </div>
            </div>
          </RevealComponent>

          <RevealComponent>
            <div className="banner" style={{ width: "100%", background: "" }}>
              <div className="instructionText">
                <h1>
                  <span className="gradientText" style={{ fontWeight: "400" }}>
                    <HiCursorClick className="instruction-icon"></HiCursorClick>
                    Select a Playlist
                  </span>
                </h1>
                <p className="bText">
                  Choose the playlist that you plan to reSequence and watch as
                  the tracks load in.
                </p>
              </div>
            </div>
          </RevealComponent>

          <RevealComponent>
            <div className="banner" style={{ width: "100%", background: "" }}>
              <div className="instructionText">
                <h1>
                  <span className="gradientText" style={{ fontWeight: "400" }}>
                    <GiCardPick className="instruction-icon"></GiCardPick>
                    Select a Song
                  </span>
                </h1>
                <p className="bText">
                  First choose a sequencing mode by clicking one of the buttons
                  at the top of the Sequencer page. Then select the song that
                  you want to be the first in the new playlist. The playlist
                  will then sort rapidly in the browser.
                </p>
              </div>
            </div>
          </RevealComponent>

          <RevealComponent>
            <div className="banner" style={{ width: "100%", background: "" }}>
              <div className="instructionText">
                <h1>
                  <span className="gradientText" style={{ fontWeight: "400" }}>
                    <IoMdCloudUpload className="instruction-icon"></IoMdCloudUpload>
                    Upload Playlist to Spotify
                  </span>
                </h1>
                <p className="bText">
                  Click on the "Export Playlist" button and your playlist will
                  be ready in Spotify - though it may take a few seconds to
                  appear in the app depending on when your app refreshes.
                </p>
              </div>
            </div>
          </RevealComponent>

          <RevealComponent>
            <div className="banner" style={{ width: "100%", background: "" }}>
              <div className="instructionText">
                <h1>
                  <span className="gradientText" style={{ fontWeight: "400" }}>
                    <IoPersonRemoveOutline className="instruction-icon"></IoPersonRemoveOutline>
                    Revoke Permissions
                  </span>
                </h1>
                <p className="bText">
                  At any time you can revoke Sequence's access permissions by
                  clicking on your avatar and selecting "Log out", or from
                  within Spotify using their "Manage Apps Page."
                </p>
              </div>
            </div>
          </RevealComponent>
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
                Sequence was built by coupling a React component oriented
                front-end (streamlined using AntDesign) with an Express
                back-end. Authorization and authentication related requests are
                proxied to Spotify via Express and caching occurs server-side
                using a Redis client. React, Express, and Redis all run in
                separate Docker containers that sit behind an Nginx
                reverse-proxy container.
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
