

import React, { useState } from "react";
import { Box, Grid, Typography, TextField, Button, Paper, Link, Stack } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import SendIcon from "@mui/icons-material/Send";
import axios from "axios";
import api from "../api/axios";

function Contact() {
  // ✅ form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ✅ loading state
  const [loading, setLoading] = useState(false);

  // ✅ handle submit
  const handleSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      await api.post("/api/contact/submit/", formData);
      alert("Message sent successfully!");

      // reset form
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 12,
        minHeight: "60vh",
        background: "linear-gradient(135deg, #e3f2fd, #fce4ec)",
      
      }}
    >
      {/* Heading */}
      <Typography
        variant="h3"
        align="center"
        fontWeight="bold"
        sx={{
          color: "#0b0c26",
          mb: 1,
          letterSpacing: "1px",
        }}
      >
        Contact Us
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        sx={{ mb: 6, fontSize: "1.2rem" }}
      >
        We'd love to hear from you! Feel free to reach out any time.
      </Typography>

      {/* Main Section */}
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ maxWidth: 1100, mx: "auto" }}
      >
        {/* Left Info Card */}
        <Grid item xs={12} md={4} sx={{ display: "flex" }}>
          <Paper
            elevation={5}
            sx={{
              flex: 1,
              p: 4,
              borderRadius: "20px",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
              transition: "0.4s",
              "&:hover": {
                transform: "translateY(-8px)",
                boxShadow: "0px 12px 35px rgba(0,0,0,0.15)",
              },
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: "15px",
                mb: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #6a85f1, #8ec5fc)",
              }}
            >
              <ChatBubbleOutlineIcon sx={{ color: "#fff", fontSize: 30 }} />
            </Box>

            <Typography variant="h5" fontWeight="bold" mb={2}>
              Get in Touch
            </Typography>

            <Typography color="text.secondary" mb={3}>
              We usually respond within 24 hours. Reach us anytime through email.
            </Typography>

            {/* Email Display */}
            <Stack direction="row" spacing={2} alignItems="center">
              <EmailIcon sx={{ fontSize: 30, color: "#3579f6" }} />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Email
                </Typography>
                <Link
                  href="mailto:support@neuroscan-ai.com"
                  underline="none"
                  sx={{ color: "#0b57d0", fontSize: "0.95rem" }}
                >
                  support@cerescan-ai.com
                </Link>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        {/* Right Form Card */}
        <Grid item xs={12} md={8} sx={{ display: "flex" }}>
          <Paper
            elevation={5}
            sx={{
              flex: 1,
              p: 4,
              borderRadius: "20px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              boxShadow: "0px 8px 25px rgba(0,0,0,0.1)",
            }}
          >
            <Stack spacing={3}>
              <TextField
                label="Your Name"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f7faff",
                  },
                }}
              />

              <TextField
                label="Your Email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f7faff",
                  },
                }}
              />

              <TextField
                label="Your Message"
                multiline
                rows={5}
                fullWidth
                variant="outlined"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    backgroundColor: "#f7faff",
                  },
                }}
              />

              {/* Button */}
              <Button
                variant="contained"
                size="large"
                endIcon={<SendIcon />}
                onClick={handleSubmit} // ✅ attached
                disabled={loading}
                sx={{
                  alignSelf: "flex-start",
                  px: 4,
                  py: 1.5,
                  borderRadius: "12px",
                  fontSize: "1.05rem",
                  fontWeight: "bold",
                  textTransform: "none",
                  background: "linear-gradient(90deg, #6a85f1, #8ec5fc)",
                  transition: "0.3s",
                  "&:hover": {
                    background: "linear-gradient(90deg, #5a75e6, #7bb8f3)",
                    transform: "translateY(-3px)",
                  },
                }}
              >
                {loading ? "Sending..." : "Send Message"}
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Contact;
