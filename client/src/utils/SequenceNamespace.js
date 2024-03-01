import { ActivateAnimation } from "./styling/ActivateAnimation";
import { updateAudioAnalysisCache } from "./updateCache/updateAudioAnalysisCache";

// Closure and encapsulation for shared state
export const SequenceNamespace = (function () {
  const globalVars = {
    songList: [],
    playlistList: [],
    playlistId: null,
    playlistName: null,
    sequencingMode: null,
    expectedNumSongs: null,
    songListFromCache: null,
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
          if (!globalVars.songListFromCache) {
            // If not from cache, update cache
            updateAudioAnalysisCache();
          }

          // The expected number of songs have been successfully fetched
          console.log(globalVars[arrayKey]);
          ActivateAnimation();
        }
      }
    },
  };
})();
