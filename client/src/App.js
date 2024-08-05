import React from "react";
import { Route, Routes } from "react-router-dom";
import Entry from "./Routes/Entry";
import SequencerPage from "./Routes/SequencerPage";
import Help from "./Routes/Help";
import NotFound from "./Routes/Exceptions/NotFound";
import Forbidden from "./Routes/Exceptions/Forbidden";
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/sequencer" element={<SequencerPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/401" element={<Forbidden />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
