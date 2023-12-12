import React from "react";
import "./SidebarElement.css";

const SidebarElement = ({ image, title }) => {
  return (
    <li className="playlistElement">
      <img src={image} class="playlistImage" alt={`playlist artwork for ${title}`}></img>
      <p class="playlistTitle">{title}</p>
    </li>
  );
};

export default SidebarElement;
