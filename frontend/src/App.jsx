// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage"; // path to your HomePage
import UploadMRI from "./pages/UploadMRI";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for HomePage */}
        <Route path="/" element={<HomePage />} />
         <Route path="/upload" element={<UploadMRI />} />
      </Routes>
    </Router>
  );
}

export default App;
