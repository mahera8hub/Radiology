import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import logo from "../assets/logo.png"; // ✅ ensure src/assets/logo.png exists

export default function Navbar() {
  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        padding: "0.5rem 2rem",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side - Logo */}
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
              display: "flex",
              alignItems: "center",
              background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            CereScan AI
          </Typography>
        </Box>

        {/* Right Side - Navigation Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <RouterLink to="/" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                color: "#3B82F6",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                "&:hover": { backgroundColor: "transparent", color: "#2563EB" },
              }}
            >
              Home
            </Button>
          </RouterLink>

          <RouterLink to="/upload" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                color: "#374151",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { color: "#3B82F6" },
              }}
            >
              Upload
            </Button>
          </RouterLink>

          <RouterLink to="/about" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                color: "#374151",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { color: "#3B82F6" },
              }}
            >
              About
            </Button>
          </RouterLink>

          {/* ✅ New Team Section */}
          <RouterLink to="/team" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                color: "#374151",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { color: "#3B82F6" },
              }}
            >
              Team
            </Button>
          </RouterLink>

          <RouterLink to="/contact" style={{ textDecoration: "none" }}>
            <Button
              sx={{
                color: "#374151",
                textTransform: "none",
                fontWeight: 500,
                "&:hover": { color: "#3B82F6" },
              }}
            >
              Contact
            </Button>
          </RouterLink>

          <RouterLink to="/signin" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
                color: "white",
                textTransform: "none",
                fontWeight: "bold",
                borderRadius: "20px",
                px: 2.5,
                py: 0.7,
                "&:hover": {
                  background: "linear-gradient(to right, #2563EB, #7C3AED)",
                },
              }}
            >
              Sign In
            </Button>
          </RouterLink>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
