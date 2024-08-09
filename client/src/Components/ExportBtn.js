import React from "react";
import "./ExportBtn.css";
import { IoMdCloudUpload } from "react-icons/io";

const ExportBtn = () => {
  return (
    <button className="export-btn">
      Export Playlist
      <IoMdCloudUpload
        size={20}
        style={{ marginLeft: "8px" }}
      ></IoMdCloudUpload>
    </button>
  );
};

export default ExportBtn;
