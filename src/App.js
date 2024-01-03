import React from 'react';
import Navbar from './components/Navbar';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';  // Import Routes instead of Switch
import Home from './components/pages/Home';
import AboutUs from './components/pages/AboutUs';
import Features from './components/pages/Features';
import TryBeanhub from './components/pages/TryBeanhub';

function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about-us' element={<AboutUs />} />
          <Route path='/features' element={<Features />} />
          <Route path='/try-beanhub' element={<TryBeanhub />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
