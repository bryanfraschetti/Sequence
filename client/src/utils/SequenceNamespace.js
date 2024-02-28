import { ActivateAnimation } from "./styling/ActivateAnimation";

// Closure and encapsulation for shared state
export const SequenceNamespace = (function () {
  const globalVars = {
    songList: [],
    playlistId: null,
    playlistName: null,
    sequencingMode: null,
  }; // Variables that are shared across JS functions

  return {
    getVar: function (property) {
      return globalVars[property];
    }, // Read closed value

    setVar: function (property, value) {
      globalVars[property] = value;
    }, // Set closed value

    appendArray: function (arrayKey, valueToPush) {
      // Append a value to an array (the only array is songList)
      if (Array.isArray(globalVars[arrayKey])) {
        globalVars[arrayKey].push(valueToPush);
        // console.log(globalVars[arrayKey]);
        if (
          globalVars[arrayKey].length ===
          parseInt(localStorage.getItem("expectedNumSongs"))
        ) {
          // The expected number of songs have been successfully fetched
          ActivateAnimation(); // Toggle animation state
        }
      }
    },
  };
})();
