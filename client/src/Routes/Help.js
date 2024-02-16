import React from "react";
import NavBar from "../Components/NavBar";
import { ResizeAnimationStopper } from "../utils/styling/ResizeAnimationStopper";
import LogOut from "../Components/LogOut";

const Help = () => {
  ResizeAnimationStopper();

  return (
    <div>
      <LogOut></LogOut>
      <NavBar></NavBar>
    </div>
  );
};

export default Help;
