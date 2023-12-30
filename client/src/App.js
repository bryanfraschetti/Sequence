import React from "react";
import { Route, Routes } from "react-router-dom";
import Entry from "./Routes/Entry";
import SequencerPage from "./Routes/SequencerPage";
import Help from "./Routes/Help";
import About from "./Routes/About";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Entry />} />
        <Route path="/sequencer" element={<SequencerPage />} />
        <Route path="/help" element={<Help />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
};

export default App;
