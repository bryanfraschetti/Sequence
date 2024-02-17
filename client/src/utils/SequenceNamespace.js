import { ActivateAnimation } from "./styling/ActivateAnimation";

//closure and encapsulation for shared state
export const SequenceNamespace = (function () {
  const globalVars = {
    songList: [],
    sequencingMode: null,
  };

  return {
    getVar: function (property) {
      return globalVars[property];
    },
    setVar: function (property, value) {
      globalVars[property] = value;
    },
    appendArray: function (arrayKey, valueToPush) {
      if (Array.isArray(globalVars[arrayKey])) {
        globalVars[arrayKey].push(valueToPush);
        // console.log(globalVars[arrayKey]);
        if (globalVars[arrayKey].length == localStorage.getItem("expectedNumSongs")) {
          ActivateAnimation();
        }
      }
    },
  };
})();
