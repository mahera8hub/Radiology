import React from "react";
import { Box, Grid, Card, Typography } from "@mui/material";
import MedicalInformationIcon from "@mui/icons-material/MedicalInformation";
import InsightsIcon from "@mui/icons-material/Insights";
import PsychologyIcon from "@mui/icons-material/Psychology";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";

export default function AboutPage() {
  return (
    <Box
      sx={{
        position: "relative",
        overflow: "hidden",
        px: { xs: 2, sm: 4, md: 6 },
        py: { xs: 6, md: 8 },
        pt: { xs: "90px", md: "70px" },
      }}
    >
      {/* ------------------ BACKGROUND GLOW ------------------ */}
      <Box
        sx={{
          position: "absolute",
          top: "-150px",
          left: "-150px",
          width: { xs: "250px", md: "350px" },
          height: { xs: "250px", md: "350px" },
          background: "rgba(80,150,255,0.35)",
          filter: "blur(120px)",
          borderRadius: "50%",
          zIndex: -1,
        }}
      />

      <Box
        sx={{
          position: "absolute",
          bottom: "-150px",
          right: "-150px",
          width: { xs: "250px", md: "350px" },
          height: { xs: "250px", md: "350px" },
          background: "rgba(120,80,255,0.35)",
          filter: "blur(120px)",
          borderRadius: "50%",
          zIndex: -1,
        }}
      />

      {/* ------------------ ABOUT HEADING ------------------ */}
      <Box sx={{ textAlign: "center", mt: { xs: 3, md: 5 }, mb: { xs: 3, md: 4 } }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: "bold",
            fontSize: { xs: "1.9rem", sm: "2.3rem", md: "3rem" },
            background: "linear-gradient(90deg, #3B6CE7, #6F9FFF)",
            WebkitBackgroundClip: "text",
            color: "transparent",
            display: "inline-block",
            position: "relative",
            pb: 1,
            animation: "fadeIn 1.2s ease",
          }}
        >
          About <span style={{ color: "#3B6CE7" }}>Cere</span>Scan AI
          <span
            style={{
              position: "absolute",
              left: 0,
              bottom: 0,
              width: "100%",
              height: "4px",
              background: "linear-gradient(90deg, #3B6CE7, #6F9FFF)",
              borderRadius: "4px",
              animation: "underlineAnim 1.4s ease forwards",
              transformOrigin: "left",
            }}
          />
        </Typography>
      </Box>

      {/* ------------------ MISSION SECTION ------------------ */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: { xs: 4, md: 6 } }}>
        <Box
          sx={{
            maxWidth: "1100px",
            width: "100%",
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
            background: "rgba(255,255,255,0.85)",
            backdropFilter: "blur(7px)",
            border: "1px solid rgba(200,200,200,0.3)",
            textAlign: "center",
            animation: "fadeIn 1.4s ease",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: 2,
              fontSize: { xs: "1.5rem", sm: "1.9rem", md: "2.2rem" },
              background: "linear-gradient(90deg, #3B6CE7, #4989FF)",
              WebkitBackgroundClip: "text",
              color: "transparent",
            }}
          >
            Our Mission
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#555",
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
              maxWidth: "900px",
              mx: "auto",
            }}
          >
            We believe every second matters when it comes to brain health.
            CereScan AI empowers healthcare professionals with advanced AI
            tools for early tumor detection, accurate diagnosis, and faster
            medical decisions—saving lives with technology.
          </Typography>
        </Box>
      </Box>

      {/* ------------------ FEATURES ------------------ */}
      <Grid
        container
        spacing={{ xs: 2, md: 4 }}
        sx={{
          maxWidth: "1200px",
          mx: "auto",
          justifyContent: "center",
          animation: "fadeIn 1.6s ease",
        }}
      >
        {[
          {
            icon: <MedicalInformationIcon fontSize="inherit" />,
            title: "Advanced Technology",
            desc: "Built with state-of-the-art AI deep learning models.",
            bg: "linear-gradient(135deg, #4989FF, #3B6CE7)",
          },
          {
            icon: <InsightsIcon fontSize="inherit" />,
            title: "High Accuracy",
            desc: "Achieves over 89% accuracy across multiple tumor types.",
            bg: "linear-gradient(135deg, #8F57FF, #6A2EFF)",
          },
          {
            icon: <PsychologyIcon fontSize="inherit" />,
            title: "Medical Partnership",
            desc: "Developed with neurology & radiology experts.",
            bg: "linear-gradient(135deg, #15CDA8, #0FA87A)",
          },
          {
            icon: <HealthAndSafetyIcon fontSize="inherit" />,
            title: "Research Backed",
            desc: "Based on peer-reviewed medical research & studies.",
            bg: "linear-gradient(135deg, #34A6FF, #0084FF)",
          },
        ].map((box, idx) => (
          <Grid item xs={12} sm={6} md={6} key={idx}>
            <Card
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 4,
                boxShadow: 4,
                display: "flex",
                alignItems: "center",
                gap: 2,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
                },
              }}
            >
              <Box
                sx={{
                  width: { xs: 45, md: 55 },
                  height: { xs: 45, md: 55 },
                  borderRadius: 2,
                  background: box.bg,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                  fontSize: { xs: "24px", md: "30px" },
                }}
              >
                {box.icon}
              </Box>

              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  sx={{ fontSize: { xs: "1rem", md: "1.15rem" } }}
                >
                  {box.title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.85rem", md: "0.95rem" } }}
                >
                  {box.desc}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ANIMATIONS */}
      <style>
        {`
        @keyframes fadeIn {  
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes underlineAnim {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }
        `}
      </style>
    </Box>
  );
}