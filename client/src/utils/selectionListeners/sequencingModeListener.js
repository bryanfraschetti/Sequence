//radio button emulation

import { SequenceNamespace } from "../SequenceNamespace";

export const sequencingModeListener = () => {
  const btnSet = document.getElementsByClassName("sequencer-buttons");

  for (let i = 0; i < btnSet.length; i++) {
    //for each button add an event listener
    btnSet[i].addEventListener("click", (e) => {
      e.currentTarget.classList.remove("inactive-sequencer"); //remove inactive class from clicked button
      e.currentTarget.classList.add("active-sequencer"); //add active class to clicked button
      e.currentTarget.parentElement.classList.remove("seq-wrapper-inactive");
      e.currentTarget.parentElement.classList.add("seq-wrapper-active");

      const prevActiveBtnId = SequenceNamespace.getVar("sequencingMode");

      if (prevActiveBtnId !== null && prevActiveBtnId !== e.currentTarget) {
        const prevActiveBtn = document.getElementById(prevActiveBtnId);
        prevActiveBtn.classList.add("inactive-sequencer"); //make old stored button inactive
        prevActiveBtn.classList.remove("active-sequencer"); //remove active
        prevActiveBtn.parentElement.classList.add("seq-wrapper-inactive");
        prevActiveBtn.parentElement.classList.remove("seq-wrapper-active");
      }

      SequenceNamespace.setVar("sequencingMode", e.currentTarget.id); //set stored active button equal to current target
    });
  }
};
