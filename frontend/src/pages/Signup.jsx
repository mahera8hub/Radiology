

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Typography,
  Button,
  Avatar,
  MenuItem,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const GradientButton = styled(Button)({
  background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
  color: "#fff",
  fontWeight: 600,
  borderRadius: "28px",
  padding: "10px 24px",
  textTransform: "none",
  boxShadow: "0 6px 20px rgba(37,117,252,0.22)",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 10px 30px rgba(106,17,203,0.25)",
  },
});

const SIGNUP_ENDPOINT = "http://127.0.0.1:8000/api/doctor/signup/";

export default function DoctorSignup() {
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    hospital: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!doctor.name.trim()) return setError("Enter full name");
    if (!doctor.email.trim()) return setError("Enter email");
    if (!doctor.phone.trim()) return setError("Enter phone number");
    if (!doctor.specialization.trim()) return setError("Select specialization");
    if (!doctor.password.trim()) return setError("Enter password");
    if (doctor.password !== doctor.confirmPassword)
      return setError("Passwords do not match");
    return true;
  };


const handleSignup = async () => {
  setError(""); // reset previous errors
  if (!validate()) return;

  const payload = {
    name: doctor.name,
    email: doctor.email,
    phone: doctor.phone,
    specialization: doctor.specialization,
    hospital: doctor.hospital,
    password: doctor.password,
    confirmPassword: doctor.confirmPassword,
  };

  try {
    const res = await axios.post(SIGNUP_ENDPOINT, payload, {
      headers: {
        "Content-Type": "application/json", // ✅ Important!
      },
    });

    const savedDoctor = res.data?.doctor || res.data;
    if (!savedDoctor) {
      setError("Invalid response from backend");
      return;
    }

    localStorage.setItem("doctor", JSON.stringify(savedDoctor));
    window.dispatchEvent(new Event("doctorSignup"));

    alert("Signup Successful!");
    window.dispatchEvent(new Event("doctorSignup"));

    navigate("/upload");
  } catch (err) {
    const data = err.response?.data;

    if (data && typeof data === "object") {
      // Convert object errors into readable string
      const messages = Object.entries(data).map(
        ([key, value]) => `${key}: ${value.join(", ")}`
      );
      setError(messages.join(" | ")); // Combine all errors with separator
    } else {
      setError(err.response?.data?.error || "Signup failed");
    }
  }
};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f7f9fc",
        px: 2,
        pt: "90px",
      }}
    >
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card sx={{ width: 480, p: 3, borderRadius: 4 }}>
          <CardContent>
            <Box textAlign="center" mb={3}>
              <Avatar sx={{ bgcolor: "#6a11cb", width: 60, height: 60, m: "auto" }}>
                <MedicalServicesIcon />
              </Avatar>
              <Typography variant="h5" fontWeight={700} mt={1}>
                Doctor Signup
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register to access the MRI Diagnostic System
              </Typography>
            </Box>

            {/* Only string errors */}
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box display="flex" flexDirection="column" gap={2}>
              <TextField
                label="Full Name"
                name="name"
                value={doctor.name}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                value={doctor.email}
                onChange={handleChange}
              />
              <TextField
                label="Phone Number"
                name="phone"
                value={doctor.phone}
                onChange={handleChange}
              />
              <TextField
                select
                label="Specialization"
                name="specialization"
                value={doctor.specialization}
                onChange={handleChange}
              >
                <MenuItem value="Neurologist">Neurologist</MenuItem>
                <MenuItem value="Radiologist">Radiologist</MenuItem>
                <MenuItem value="Neurosurgeon">Neurosurgeon</MenuItem>
                <MenuItem value="General Physician">General Physician</MenuItem>
              </TextField>
              <TextField
                label="Hospital / Clinic"
                name="hospital"
                value={doctor.hospital}
                onChange={handleChange}
              />
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={doctor.password}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={doctor.confirmPassword}
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <GradientButton fullWidth sx={{ mt: 3 }} onClick={handleSignup}>
              Create Account
            </GradientButton>

            <Typography
              textAlign="center"
              mt={2}
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/doctor-login")}
            >
              Already have an account? Login
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}
