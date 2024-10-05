import { ActivateAnimation } from "./styling/ActivateAnimation";
import { addTrackToDom } from "./styling/addTrackToDom";

// Closure and encapsulation for shared state
export const SequenceNamespace = (function () {
  const globalVars = {
    songList: [],
    playlistList: [],
    playlistId: null,
    playlistName: null,
    sequencingMode: null,
    expectedNumSongs: null,
    NewSequence: null,
    playlistPrefix: "",
    sequenceUrl: "https://sequencewav.com",
  }; // Variables that are shared across JS functions

  return {
    getVar: function (property) {
      return globalVars[property];
    }, // Read closed value

    setVar: function (property, value) {
      globalVars[property] = value;
    }, // Set closed value

    appendArray: function (arrayKey, valueToPush) {
      if (Array.isArray(globalVars[arrayKey])) {
        globalVars[arrayKey].push(valueToPush);

        if (
          // If modifying songList, check to see if we have captured all songs
          arrayKey === "songList" &&
          globalVars[arrayKey].length === globalVars.expectedNumSongs
        ) {
          // The expected number of songs have been successfully fetched
          //   console.log(globalVars[arrayKey]);
          globalVars[arrayKey].forEach((song) => {
            addTrackToDom(song);
          });
          ActivateAnimation();
        }
      }
    },
  };
})();
