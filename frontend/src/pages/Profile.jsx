import React, { useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  Button,
  Divider,
  IconButton,
  TextField,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import LogoutIcon from "@mui/icons-material/Logout";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [doctor, setDoctor] = useState(() =>
    JSON.parse(localStorage.getItem("doctor") || "null")
  );
  const [avatarPreview, setAvatarPreview] = useState(doctor?.avatar || null);
  const [specialization, setSpecialization] = useState(doctor?.specialization || "");
  const [hospital, setHospital] = useState(doctor?.hospital || "");
  const [saving, setSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  if (!doctor) {
    return (
      <Box sx={{ p: { xs: 2, md: 4 }, textAlign: "center", mt: 10 }}>
        <Typography>Please login first.</Typography>
      </Box>
    );
  }

  // Compress image using canvas before converting to base64
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSnackbar({ open: true, message: "Please select a valid image file", severity: "error" });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_SIZE = 300;
        let { width, height } = img;

        if (width > height && width > MAX_SIZE) {
          height *= MAX_SIZE / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width *= MAX_SIZE / height;
          height = MAX_SIZE;
        }

        canvas.width = width;
        canvas.height = height;
        canvas.getContext("2d").drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        setAvatarPreview(compressedBase64);
      };
      img.onerror = () => {
        setSnackbar({ open: true, message: "Could not load image", severity: "error" });
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaving(true);
    try {
      const updatedDoctor = {
        ...doctor,
        avatar: avatarPreview,
        specialization,
        hospital,
      };

      localStorage.setItem("doctor", JSON.stringify(updatedDoctor));
      setDoctor(updatedDoctor);

      // tell Navbar (and any other listener) that doctor data changed
      window.dispatchEvent(new Event("doctorUpdate"));

      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
    } catch (err) {
      console.error("Save failed:", err);
      setSnackbar({
        open: true,
        message: "Could not save. Try a smaller image.",
        severity: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    window.dispatchEvent(new Event("doctorLogout"));
    navigate("/doctor-signup", { replace: true });
  };

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 4, md: 6 },
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #eef2ff 0%, #f0f4f8 100%)",
      }}
    >
      <Card
        sx={{
          width: { xs: "100%", sm: 440, md: 520 },
          borderRadius: 4,
          overflow: "visible",
          boxShadow: "0px 12px 30px rgba(59,130,246,0.15)",
        }}
      >
        {/* Gradient header strip */}
        <Box
          sx={{
            height: 110,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
          }}
        />

        <CardContent sx={{ p: { xs: 3, md: 4 }, mt: -8 }}>
          {/* Avatar with upload button */}
          <Box sx={{ textAlign: "center", mb: { xs: 2, md: 3 } }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={avatarPreview || undefined}
                sx={{
                  bgcolor: "#3B82F6",
                  width: { xs: 100, md: 120 },
                  height: { xs: 100, md: 120 },
                  fontSize: { xs: 32, md: 40 },
                  fontWeight: 600,
                  border: "4px solid white",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                }}
              >
                {!avatarPreview && doctor.name?.charAt(0)?.toUpperCase()}
              </Avatar>

              <IconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  bgcolor: "#3B82F6",
                  color: "white",
                  "&:hover": { bgcolor: "#2563EB" },
                  boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                }}
              >
                <PhotoCameraIcon fontSize="small" />
              </IconButton>

              <input
                type="file"
                accept="image/*"
                hidden
                ref={fileInputRef}
                onChange={handleImageChange}
              />
            </Box>

            <Typography
              variant="h5"
              fontWeight={700}
              mt={2}
              sx={{ fontSize: { xs: "1.3rem", md: "1.5rem" } }}
            >
              {doctor.name}
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
              {doctor.email}
            </Typography>

            <Typography color="text.secondary" sx={{ fontSize: { xs: "0.9rem", md: "1rem" } }}>
              {doctor.phone}
            </Typography>
          </Box>

          <Divider sx={{ my: { xs: 2, md: 3 } }} />

          {/* Editable Details Section */}
          <Stack spacing={2.5}>
            <TextField
              label="Specialization"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              fullWidth
              size="small"
            />

            <TextField
              label="Hospital"
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              fullWidth
              size="small"
            />
          </Stack>

          {/* Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ mt: { xs: 3, md: 4 } }}
          >
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              disabled={saving}
              fullWidth
              sx={{
                background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
                fontWeight: 600,
                borderRadius: 2,
                py: 1.2,
                textTransform: "none",
              }}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>

            <Button
              variant="outlined"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              fullWidth
              sx={{
                fontWeight: 600,
                borderRadius: 2,
                py: 1.2,
                textTransform: "none",
              }}
            >
              Logout
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={2500}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}