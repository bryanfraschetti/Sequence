import React from "react";
import "./Hamburger.css";
import { toggleSidebar } from "../utils/styling/toggleSidebar";

const Hamburger = () => {
  return (
    <div id="hamburger-container" className="active">
      <input type="checkbox" id="hamburger" defaultChecked />
      <label htmlFor="hamburger" className="hamburger" onClick={toggleSidebar}>
        <span className="line"></span>
        <span className="line"></span>
        <span className="line"></span>
      </label>
    </div>
  );
};

export default Hamburger;
