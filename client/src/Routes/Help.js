import React from "react";
import NavBar from "../Components/NavBar";
import { ResizeAnimationStopper } from "../utils/styling/ResizeAnimationStopper";

const Help = () => {
  ResizeAnimationStopper();

  return (
    <div>
      <NavBar></NavBar>
    </div>
  );
};

export default Help;
