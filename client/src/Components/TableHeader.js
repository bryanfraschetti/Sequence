import React from "react";

const TableHeader = () => {
  return (
    <thead id="tracks-head">
      <tr>
        <th className="tracks-table-header"></th>
        <th className="tracks-table-header">Start Key</th>
        <th className="tracks-table-header">Start Tempo</th>
        <th className="tracks-table-header">End Key</th>
        <th className="tracks-table-header">End Tempo</th>
      </tr>
    </thead>
  );
};

export default TableHeader;
