// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage"; // path to your HomePage
import Upload from "./pages/Upload";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Contact from "./pages/Contact";
import AboutPage from "./pages/AboutPage";
import Team from "./pages/Team";
import DoctorLogin from "./pages/DoctorLogin";
import DoctorSignup from "./pages/Signup";


import Profile from "./pages/Profile";
import PatientHistory from "./pages/PatientHistory";

import "./App.css";

function App() {
  return (
    <Router>
       <Navbar/>
      <Routes>
       
        {/* Route for HomePage */}
         <Route path="/" element={<HomePage />} />
         {/* <Route path="/upload" element={<Upload />} /> */}
         <Route path="/contact" element={<Contact />} />
         <Route path="/about" element={<AboutPage />} />
         <Route path="/team" element={<Team />} />
        {/* <Route path="/sign" element={<Signup />} /> */}
         <Route path="/doctor-login" element={<DoctorLogin />} />

             <Route path="/doctor-signup" element={<DoctorSignup />} />

            <Route path="/profile" element={
  <ProtectedRoute><Profile /></ProtectedRoute>
} />
<Route path="/history" element={
  <PatientHistory/>
} />
            
             {/* 🔐 Protected Route */}
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
      </Routes>




      <Footer />
    </Router>
  );
}

export default App;
