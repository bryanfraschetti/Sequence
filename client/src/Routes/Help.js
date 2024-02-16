import React, { useEffect } from "react";
import NavBar from "../Components/NavBar";
import { ResizeAnimationStopper } from "../utils/styling/ResizeAnimationStopper";
import LogOut from "../Components/LogOut";
import { getUserid } from "../utils/dataAcquisition/getUserid";

const Help = () => {
  useEffect(() => {
    getUserid();
    ResizeAnimationStopper();
  }, []);

  return (
    <div>
      <LogOut></LogOut>
      <NavBar></NavBar>
    </div>
  );
};

export default Help;
