
// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem } from "@mui/material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const currentPath = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);

  // Load doctor from localStorage and update navbar on login/logout/signup
  useEffect(() => {
    const loadDoctor = () => {
      const storedDoctor = localStorage.getItem("doctor");
      setDoctor(storedDoctor ? JSON.parse(storedDoctor) : null);
    };

    loadDoctor(); // initial load

    window.addEventListener("doctorLogin", loadDoctor);
    window.addEventListener("doctorSignup", loadDoctor);
    window.addEventListener("doctorLogout", loadDoctor);

    return () => {
      window.removeEventListener("doctorLogin", loadDoctor);
      window.removeEventListener("doctorSignup", loadDoctor);
      window.removeEventListener("doctorLogout", loadDoctor);
    };
  }, []);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  // const currentPath = useLocation(); // instead of location

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    window.dispatchEvent(new Event("doctorLogout")); // update navbar
    handleMenuClose();
    navigate("/doctor-login"); // redirect to login
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: "0.5rem 2rem",
        zIndex: 9999,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side: Logo + Brand */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <img
            src={logo}
            alt="CereScan AI Logo"
            style={{ width: 35, height: 35, marginRight: 10 }}
          />
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CereScan AI
          </Typography>
        </Box>

        {/* Right Side: Navigation + Login/Signup/Avatar */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <RouterLink to="/" style={{ textDecoration: "none" }}>
            <Button sx={{ color: currentPath.pathname === "/" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
              Home
            </Button>
          </RouterLink>

          <RouterLink to="/upload" style={{ textDecoration: "none" }}>
            <Button sx={{ color: currentPath.pathname === "/upload" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
              Upload
            </Button>
          </RouterLink>

          <RouterLink to="/about" style={{ textDecoration: "none" }}>
            <Button sx={{ color: currentPath.pathname === "/about" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
              About
            </Button>
          </RouterLink>

          <RouterLink to="/team" style={{ textDecoration: "none" }}>
            <Button sx={{ color: currentPath.pathname === "/team" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
              Team
            </Button>
          </RouterLink>

          <RouterLink to="/contact" style={{ textDecoration: "none" }}>
            <Button sx={{ color: currentPath.pathname === "/contact" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
              Contact
            </Button>
          </RouterLink>

          {/* If NOT logged in → Show Login/Signup */}
          {!doctor && (
            <>
              <RouterLink to="/doctor-login" style={{ textDecoration: "none" }}>
                <Button
                  variant="outlined"
                  sx={{ textTransform: "none", fontWeight: 600 }}
                >
                  Login
                </Button>
              </RouterLink>

              <RouterLink to="/doctor-signup" style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  sx={{
                    background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "none",
                    borderRadius: "20px",
                  }}
                >
                  Sign Up
                </Button>
              </RouterLink>
            </>
          )}

          {/* If logged in → Show Avatar */}
          {doctor && (
            <>
              <Avatar
                sx={{ bgcolor: "#3B82F6", cursor: "pointer" }}
                onClick={handleAvatarClick}
              >
                {doctor.name.charAt(0).toUpperCase()}
              </Avatar>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem disabled>{doctor.name}</MenuItem>
                <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
                  Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
