
import React from "react";
import { Box, Card, CardContent, Typography, Avatar, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const doctor = JSON.parse(localStorage.getItem("doctor") || "null");

  if (!doctor) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Please login first.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: 4,
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f4f8",
      }}
    >
      <Card
        sx={{
          width: 520,
          borderRadius: 4,
          boxShadow: "0px 8px 25px rgba(0,0,0,0.08)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Profile Header */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar
              sx={{
                bgcolor: "#3B82F6",
                width: 90,
                height: 90,
                margin: "0 auto",
                fontSize: 36,
                fontWeight: 600,
              }}
            >
              {doctor.name?.charAt(0)?.toUpperCase()}
            </Avatar>

            <Typography variant="h5" fontWeight={700} mt={2}>
              {doctor.name}
            </Typography>

            <Typography color="text.secondary">{doctor.email}</Typography>
            <Typography color="text.secondary">{doctor.phone}</Typography>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Details Section */}
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#555", textTransform: "uppercase" }}
            >
              Specialization
            </Typography>
            <Typography sx={{ mb: 2, fontSize: 15 }}>
              {doctor.specialization || "Not Provided"}
            </Typography>

            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "#555", textTransform: "uppercase" }}
            >
              Hospital
            </Typography>
            <Typography sx={{ fontSize: 15 }}>
              {doctor.hospital || "Not Provided"}
            </Typography>
          </Box>

          {/* Buttons */}
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Button
              variant="outlined"
              color="error"
              sx={{ px: 4, py: 1.2, borderRadius: 2, fontWeight: 600 }}
              // onClick={() => {
              //   localStorage.removeItem("doctor");
              //   window.dispatchEvent(new Event("doctorLogin")); // update navbar
              //   navigate("/doctor-signup");
              // }}

onClick={() => {
  localStorage.removeItem("doctor");

  // navbar update
  window.dispatchEvent(new Event("doctorLogout"));

  // 🔥 IMPORTANT: replace navigation
  navigate("/doctor-signup", { replace: true });
}}


            >
              Logout
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
