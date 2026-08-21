// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
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
import { Box } from "@mui/material";
import "./App.css";

function App() {
  return (
    <Router>
      <Box className="app-wrapper">
        <Navbar />

        <Box component="main" className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/team" element={<Team />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/doctor-signup" element={<DoctorSignup />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route path="/history" element={<PatientHistory />} />
            <Route
              path="/upload"
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Box>

        <Footer />
      </Box>
    </Router>
  );
}

export default App;
