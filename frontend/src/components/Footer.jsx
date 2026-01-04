// src/components/Footer.jsx
import React from "react";
import { Box, Grid, Typography, Link, IconButton } from "@mui/material";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";
import logo from "../assets/logo.jpg"; // replace with your logo

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#fff",
        color: "#1f2937",
        paddingTop: "2.25rem",
        paddingBottom: "1.25rem",
        borderTop: "1px solid #e6e9ee",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          maxWidth: 1120,
          marginX: "auto",
          px: { xs: 3, md: 4 }, // ✅ adds some padding on both sides
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {/* LEFT: Logo + text */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            alignItems: "flex-start",
            gap: 2,
            pl: { xs: 0, md: 1 }, // ✅ little padding from left edge
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {logo ? (
              <img
                src={logo}
                alt="CereScan logo"
                style={{ width: 44, height: 44, borderRadius: 8 }}
              />
            ) : (
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: 1,
                  background: "linear-gradient(90deg,#3B82F6,#8B5CF6)",
                }}
              />
            )}
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: 18,
                lineHeight: 1,
                background: "linear-gradient(90deg,#3B82F6,#8B5CF6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 0.75,
              }}
            >
              CereScan AI
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", maxWidth: 320 }}>
              Advanced AI-powered brain MRI tumor classification for medical professionals.
            </Typography>
          </Box>
        </Grid>

        {/* MIDDLE: Quick Links */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", md: "center" },
            pt: { xs: 1, md: 0 },
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
            Quick Links
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <Link href="/" underline="none" sx={{ color: "#4b5563", "&:hover": { color: "#3B82F6" } }}>
              Home
            </Link>
            <Link href="/upload" underline="none" sx={{ color: "#4b5563", "&:hover": { color: "#3B82F6" } }}>
              Upload MRI
            </Link>
            <Link href="/about" underline="none" sx={{ color: "#4b5563", "&:hover": { color: "#3B82F6" } }}>
              About
            </Link>
            <Link href="/contact" underline="none" sx={{ color: "#3B82F6", "&:hover": { textDecoration: "underline" } }}>
              Contact
            </Link>
          </Box>
        </Grid>

        {/* RIGHT: Connect */}
        <Grid
          item
          xs={12}
          md={4}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "flex-start", md: "flex-end" },
            pt: { xs: 1, md: 0 },
            pr: { xs: 0, md: 2 }, // ✅ small padding from right edge
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111827", mb: 1 }}>
            Connect
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            {[FaGithub, FaTwitter, FaLinkedin].map((Icon, index) => (
              <IconButton
                key={index}
                href="#"
                sx={{
                  color: "#374151",
                  backgroundColor: "#f3f4f6",
                  width: 40,
                  height: 40,
                  "&:hover": { backgroundColor: "#e5e7eb" },
                }}
              >
                <Icon />
              </IconButton>
            ))}
          </Box>
        </Grid>
      </Grid>

      {/* Bottom copyright */}
      <Box sx={{ maxWidth: 1120, marginX: "auto", px: { xs: 3, md: 4 }, mt: 3 }}>
        <Box sx={{ borderTop: "1px solid #e6e9ee", pt: 2 }}>
          <Typography
            variant="body2"
            align="center"
            sx={{ color: "#6b7280", fontSize: 14 }}
          >
            © {new Date().getFullYear()} CereScan AI. All rights reserved. | Built with
            advanced machine learning technology.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}