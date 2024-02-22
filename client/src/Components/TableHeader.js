import React from "react";

const TableHeader = () => {
  return (
    <thead id="tracks-head">
      <tr>
        <th className="tracks-table-header">Album</th>
        <th className="tracks-table-header">Song Title</th>
        <th className="tracks-table-header">Artist</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
