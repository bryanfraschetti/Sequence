import { SequenceNamespace } from "../SequenceNamespace";
import { ActivateAnimation } from "../styling/ActivateAnimation";
import { CoF } from "../sequencingAlgorithms/CoF";
import { SM } from "../sequencingAlgorithms/SM";
// import { RSA } from "../sequencingAlgorithms/RSA";
import { Fader } from "../sequencingAlgorithms/Fader";
import { Timbre } from "../sequencingAlgorithms/Timbre";
// import { weightedTimbre } from "../sequencingAlgorithms/weightedTimbre";
import { TimbreTempo } from "../sequencingAlgorithms/TimbreTempo";
import { removeAllChildren } from "../styling/removeAllChildren";
import { addTrackToDom } from "../styling/addTrackToDom";
import { AngularSort } from "../sequencingAlgorithms/AngularSort";

export const trackSelectionListener = async () => {
  const tracksTable = document.getElementById("tracks-table");
  tracksTable.addEventListener("click", function selectTrack(e) {
    // Parent listener
    e.preventDefault();

    if (!e.target.classList.contains("tracks-table-header")) {
      const tracks = document.getElementById("tracks");

      tracks.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      ActivateAnimation();

      const sequencingMode = SequenceNamespace.getVar("sequencingMode");
      const initSongId = e.target.id;
      let NewSequence = null;
      switch (sequencingMode) {
        default:
          NewSequence = CoF(initSongId);
          SequenceNamespace.setVar("playlistPrefix", "Soothing Sequenced");
          break;
        case "cof":
          NewSequence = CoF(initSongId);
          SequenceNamespace.setVar("playlistPrefix", "Soothing Sequenced");
          break;
        case "rsm":
          NewSequence = SM(initSongId, 1); // +1 for rising
          SequenceNamespace.setVar("playlistPrefix", "Rising Sequenced");
          break;
        case "dsm":
          NewSequence = SM(initSongId, -1); // -1 for descending
          SequenceNamespace.setVar("playlistPrefix", "Falling Sequenced");
          break;
        // case "rsa":
        //   NewSequence = RSA(initSongId);
        //   SequenceNamespace.setVar("playlistPrefix", "RSA Sequenced");
        //   break;
        case "fader":
          NewSequence = Fader(initSongId);
          SequenceNamespace.setVar("playlistPrefix", "Cross-Fading Sequenced");
          break;
        case "timbre":
          NewSequence = Timbre(initSongId);
          SequenceNamespace.setVar("playlistPrefix", "Timbre Sequenced");
          break;
        // case "wt":
        //   NewSequence = weightedTimbre(initSongId);
        //   SequenceNamespace.setVar(
        //     "playlistPrefix",
        //     "Weighted Timbre Sequenced"
        //   );
        //   break;
        case "tt":
          NewSequence = TimbreTempo(initSongId);
          SequenceNamespace.setVar("playlistPrefix", "Tempo Timbre Sequenced");
          break;
        case "ang":
          NewSequence = AngularSort(initSongId);
          SequenceNamespace.setVar("playlistPrefix", "Angular Sequenced");
          break;
      }

      removeAllChildren("tracks-body");
      NewSequence.forEach((song) => {
        addTrackToDom(song);
      });

      ActivateAnimation();
    }
  });
};
