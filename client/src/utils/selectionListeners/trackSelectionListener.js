import { SequenceNamespace } from "../SequenceNamespace";
import { ActivateAnimation } from "../styling/ActivateAnimation";
import { CoF } from "../sequencingAlgorithms/CoF";
import { SM } from "../sequencingAlgorithms/SM";
import { RSA } from "../sequencingAlgorithms/RSA";
import { Fader } from "../sequencingAlgorithms/Fader";
import { Timbre } from "../sequencingAlgorithms/Timbre";
import { weightedTimbre } from "../sequencingAlgorithms/weightedTimbre";
import { TimbreTempo } from "../sequencingAlgorithms/TimbreTempo";

export const trackSelectionListener = async () => {
  const tracksTable = document.getElementById("tracks-table");
  tracksTable.addEventListener("click", function selectTrack(e) {
    // Parent listener
    e.preventDefault();

    if (!e.target.classList.contains("tracks-table-header")) {
      ActivateAnimation();

      const sequencingMode = SequenceNamespace.getVar("sequencingMode");
      const initSongId = e.target.id;

      switch (sequencingMode) {
        default:
          CoF(initSongId);
          break;
        case "cof":
          CoF(initSongId);
          break;
        case "rsm":
          SM(initSongId, 1); // +1 for rising
          break;
        case "dsm":
          SM(initSongId, -1); // -1 for descending
          break;
        case "rsa":
          RSA(initSongId);
          break;
        case "fader":
          Fader(initSongId);
          break;
        case "timbre":
          Timbre(initSongId);
          break;
        case "wt":
          weightedTimbre(initSongId);
          break;
        case "tt":
          TimbreTempo(initSongId);
          break;
      }
    }
  });
};
