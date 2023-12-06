import React from 'react'
import { Route, Routes } from "react-router-dom";
import Entry from './Routes/Entry';
import Home from './Routes/Home';
import Help from './Routes/Help';
import About from './Routes/About';

const App = () => {
  return (
      <>
        <Routes>
            <Route path="/" element={<Entry/>}/>
            <Route path="/home" element={<Home/>}/>
            <Route path='/help' element={<Help/>}/>
            <Route path='/about' element={<About/>}/>
        </Routes>
      </>
  )
}

export default App
