
import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  CircularProgress
} from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BrainIcon from "@mui/icons-material/Psychology";

const UploadMRI = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select an image first!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/predict/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setResult(
        `${response.data.predicted_class} (Confidence: ${(response.data.confidence * 100).toFixed(2)}%)`
      );
    } catch (error) {
      console.error(error);
      alert("Something went wrong! Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f0f4f8", py: 6 }}>
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Box display="flex" alignItems="center" mb={4} justifyContent="center">
            <Avatar sx={{ bgcolor: "#3f51b5", mr: 2 }}>
              <BrainIcon />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" color="primary">
              Brain Tumor Detection
            </Typography>
          </Box>

          <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Button
                variant="contained"
                component="label"
                startIcon={<UploadFileIcon />}
                fullWidth
                sx={{ mb: 3, py: 1.5 }}
              >
                Upload MRI Scan
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </Button>

              {preview && (
                <Box
                  component="img"
                  src={preview}
                  alt="Preview"
                  sx={{
                    width: "100%",
                    height: 250,
                    objectFit: "cover",
                    borderRadius: 2,
                    mb: 3,
                  }}
                />
              )}

              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleUpload}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Predict Tumor Type"}
              </Button>

              {result && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: "20px", textAlign: "center" }}
                >
                  <Typography variant="h6" color="secondary">
                    Prediction Result:
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" color="primary">
                    {result}
                  </Typography>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UploadMRI;