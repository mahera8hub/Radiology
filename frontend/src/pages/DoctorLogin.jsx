

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
  Avatar,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axios";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const LOGIN_ENDPOINT = "/api/doctor/login/";

const DoctorLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await api.post(LOGIN_ENDPOINT, formData);
      localStorage.setItem("doctor", JSON.stringify(res.data.doctor));
      window.dispatchEvent(new Event("doctorLogin"));
      navigate("/upload"); // login ke baad upload page
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f3f4f6",
        px: 2,
      }}
    >
      <Card
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
          position: "relative",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Avatar
            sx={{ bgcolor: "#6a11cb", width: 60, height: 60, margin: "0 auto" }}
          >
            <LockOutlinedIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight={700} mt={2}>
            Doctor Login
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Access your account to upload MRI scans
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            autoComplete="current-password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 600,
              background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #2575fc 0%, #6a11cb 100%)",
              },
            }}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <Typography textAlign="center" mt={2} variant="body2">
          Don’t have an account?{" "}
          <Button
            component={RouterLink}
            to="/doctor-signup"
            sx={{
              color: "#6a11cb",
              textTransform: "none",
              minWidth: "auto",
              padding: 0,
              fontWeight: 600,
            }}
          >
            Sign up
          </Button>
        </Typography>
      </Card>
    </Box>
  );
};

export default DoctorLogin;
