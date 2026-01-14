// src/pages/Upload.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axios";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  LinearProgress,
  TextField,
  Drawer,
  IconButton,
  Divider,
  Tooltip,
  Stack,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from "@mui/material";
import { styled, keyframes } from "@mui/system";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import BrainIcon from "@mui/icons-material/Psychology";
import jsPDF from "jspdf";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";


// ---------- Styles ----------
const pulse = keyframes`
  0% { box-shadow: 0 0 15px rgba(58, 123, 213, 0.18); }
  50% { box-shadow: 0 0 30px rgba(58, 123, 213, 0.38); }
  100% { box-shadow: 0 0 15px rgba(58, 123, 213, 0.18); }
`;

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

const HISTORY_KEY = "mri_analyzer_history_v1";

const PREDICT_ENDPOINT = "/api/predict/";

const onlyLetters = (v) => /^[a-zA-Z\s]*$/.test(v);
const onlyNumbers = (v) => /^[0-9]*$/.test(v);


// ---------- Confirm Dialog ----------
function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title || "Confirm"}</DialogTitle>
      <DialogContent>
        <Typography>{message || "Are you sure?"}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button onClick={onConfirm} color="error">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ---------- Component ----------
export default function Upload() {
  // state
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [patient, setPatient] = useState({
    name: "",
    age: "",
    gender: "",
    doctor: "",
    notes: "",
  });

  const [history, setHistory] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(() => () => {});

  // load history
  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch {
        localStorage.removeItem(HISTORY_KEY);
      }
    }
  }, []);

  // file -> preview
  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };


  const patientNames = Array.from(
  new Set(history.map((h) => h.patient?.name).filter(Boolean))
);

const doctorNames = Array.from(
  new Set(history.map((h) => h.patient?.doctor).filter(Boolean))
);



const validate = () => {
  if (!patient.name.trim()) {
    alert("Patient name is required");
    return false;
  }

  if (!patient.age.trim()) {
    alert("Age is required");
    return false;
  }

  if (!patient.gender) {
    alert("Please select gender");
    return false;
  }

  if (!file) {
    alert("Please upload MRI image");
    return false;
  }

  return true;
};

//Reset function
const resetForm = () => {
  setPatient({
    name: "",
    age: "",
    gender: "",
    doctor: "",
    notes: "",
  });
  setFile(null);
  setPreview("");
  setResult(null);
};


  // upload & predict (real backend)
  const handleUpload = async () => {
    if (!validate()) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);
    try {
      const res = await api.post(PREDICT_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });




    // adapt to backend shape: prefer predicted_class and confidence (0..1)
      const label = res.data.predicted_class ?? res.data.label ?? "Unknown";
      let confidence = res.data.confidence ?? res.data.probability ?? res.data.prob ?? null;
      if (confidence !== null && confidence !== undefined) {
        // if 0..1 => convert to percent
        confidence = Number(confidence) <= 1 ? (Number(confidence) * 100).toFixed(2) : Number(confidence).toFixed(2);
      } else {
        confidence = "0.00";
      }

      const final = { label, confidence };
      setResult(final);

      // save to history but DO NOT auto-open drawer per requirement
      const entry = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        patient: { ...patient },
        filename: file.name,
        result: final,
        preview,
      };
      const newHistory = [entry, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      // do NOT setDrawerOpen(true) here — remains closed
    } catch (err) {
      console.error("Prediction error:", err);
      alert("Prediction failed. Check backend or endpoint.");
    } finally {
      setLoading(false);
    }
  };

  // PDF generation
  const downloadPdfReport = (entry = null) => {
    const data = entry
      ? entry
      : {
          timestamp: new Date().toISOString(),
          patient,
          filename: file ? file.name : "image",
          result,
          preview,
        };

    if (!data.result) {
      alert("No result to export. Predict first or choose a history item.");
      return;
    }

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const pageW = doc.internal.pageSize.getWidth();
      let y = 60;

      doc.setFontSize(18);
      doc.text("MRI — AI Diagnostic Report", margin, y);
      y += 20;
      doc.setFontSize(11);
      doc.text(`Generated: ${new Date(data.timestamp).toLocaleString()}`, margin, y);
      y += 18;

      doc.setFontSize(12);
      doc.text("Patient Details", margin, y);
      y += 14;
      doc.setFontSize(10);
      doc.text(`Name: ${data.patient.name}`, margin, y);
      y += 12;
      doc.text(`Age: ${data.patient.age}`, margin, y);
      y += 12;
      doc.text(`Gender: ${data.patient.gender}`, margin, y);
      y += 12;
      if (data.patient.doctor) {
        doc.text(`Referring Doctor: ${data.patient.doctor}`, margin, y);
        y += 12;
      }
      if (data.patient.notes) {
        y += 4;
        doc.text("Notes:", margin, y);
        y += 10;
        const split = doc.splitTextToSize(data.patient.notes, pageW - margin * 2);
        doc.text(split, margin, y);
        y += split.length * 12;
      }

      y += 8;
      doc.setFontSize(12);
      doc.text("AI Result", margin, y);
      y += 14;
      doc.setFontSize(10);
      doc.text(`Tumor Type: ${data.result.label}`, margin, y);
      y += 12;
      doc.text(`Confidence: ${data.result.confidence}%`, margin, y);

      // add preview image on right if available
      if (data.preview) {
        try {
          const imgW = 220;
          const imgH = 220;
          const xImg = pageW - margin - imgW;
          const yImg = 110;
          doc.addImage(data.preview, "PNG", xImg, yImg, imgW, imgH, undefined, "FAST");
        } catch (e) {
          console.warn("Failed to add image to PDF", e);
        }
      }

      doc.setFontSize(9);
      doc.text("Note: AI-assisted report. Clinical correlation required.", margin, doc.internal.pageSize.getHeight() - 40);

      const safeName = (data.patient.name || "patient").replace(/\s+/g, "_");
      doc.save(`MRI_Report_${safeName}_${new Date(data.timestamp).toISOString().slice(0,19)}.pdf`);
    } catch (err) {
      console.error(err);
      alert("Failed to generate PDF.");
    }
  };

  // load history entry
  const loadHistoryEntry = (entry) => {
    setPatient({ ...entry.patient });
    setResult({ ...entry.result });
    setPreview(entry.preview);
    setFile({ name: entry.filename }); // placeholder so filename shows
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // delete entry with confirm dialog
  const confirmAndDelete = (id) => {
    setConfirmAction(() => () => {
      const newH = history.filter((h) => h.id !== id);
      setHistory(newH);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newH));
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  // clear all history
  const confirmAndClearAll = () => {
    setConfirmAction(() => () => {
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  // nice color helper
  const getResultColor = (label) => {
    if (!label) return "#1976d2";
    return label.toLowerCase().includes("tumor") ? "#6a11cb" : "#2e7d32";
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#f7f9fc",
        px: { xs: 2, md: 6 },
        py: 13,
        boxSizing: "border-box",
        overflowX: "hidden",
        fontFamily: "Poppins, sans-serif",
      }}
    >
      {/* top bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center" gap={2}>
          <Avatar sx={{ bgcolor: "#3f51b5" }}>
            <BrainIcon />
          </Avatar>
          <div>
            <Typography variant="h4" fontWeight={800}>
              Brain MRI Detection
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Upload MRI — get AI prediction — generate report
            </Typography>
          </div>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title="Open history">
            <IconButton
              color="primary"
              onClick={() => setDrawerOpen(true)}
              sx={{
                border: "1px solid rgba(0,0,0,0.06)",
                bgcolor: "#fff",
                boxShadow: "0 4px 12px rgba(16,24,40,0.04)",
              }}
            >
              <HistoryIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        <Card sx={{ p: 3, borderRadius: 3, mb: 4, width: "100%" }}>
          <CardContent>
            {/* patient inputs */}
            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
              <TextField
                label="Patient Name"
                value={patient.name}
                onChange={(e) => setPatient({ ...patient, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Age"
                value={patient.age}
                onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                sx={{ width: 140 }}
              />

         <TextField
  select
  label="Gender"
  value={patient.gender}
  onChange={(e) =>
    setPatient({ ...patient, gender: e.target.value })
  }
  fullWidth
  sx={{ minWidth: 160 }}
>
  <MenuItem value="Male">Male</MenuItem>
  <MenuItem value="Female">Female</MenuItem>
  <MenuItem value="Other">Other</MenuItem>
</TextField>

              <TextField
                label="Referring Doctor"
                value={patient.doctor}
                onChange={(e) => setPatient({ ...patient, doctor: e.target.value })}
                sx={{ minWidth: 200 }}
              />
            </Box>

            <TextField
              label="Notes (symptoms / comments)"
              value={patient.notes}
              onChange={(e) => setPatient({ ...patient, notes: e.target.value })}
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 2 }}
            />

            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <Button variant="outlined" component="label" startIcon={<UploadFileIcon />}>
                Upload MRI Scan
                <input hidden accept="image/*" type="file" onChange={handleFileChange} />
              </Button>

              <GradientButton onClick={handleUpload} disabled={loading}>
                {loading ? "Analyzing..." : "Predict & Save"}
              </GradientButton>

              <Button
                variant="contained"
                color="secondary"
                startIcon={<PictureAsPdfIcon />}
                onClick={() => downloadPdfReport()}
                disabled={!result}
              >
                Download PDF
              </Button>

              <Button variant="text" color="error" startIcon={<DeleteIcon />} onClick={confirmAndClearAll}>
                Clear History
              </Button>
            </Box>

            {/* file name */}
            {file && file.name && (
              <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic" }}>
                📁 {file.name}
              </Typography>
            )}

            {/* big preview */}
            {preview && (
              <Box
                component="img"
                src={preview}
                alt="MRI preview"
                sx={{
                  width: "100%",
                  height: { xs: 260, md: 480 },
                  objectFit: "contain",
                  mt: 2,
                  borderRadius: 2,
                  border: "1px solid #e8eef9",
                  backgroundColor: "#fff",
                }}
              />
            )}

            {/* loading */}
            {loading && (
              <Box sx={{ mt: 2 }}>
                <Typography>⏳ Contacting model — scanning image...</Typography>
                <LinearProgress sx={{ mt: 1, borderRadius: 2 }} />
              </Box>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card sx={{ maxWidth: 840, p: 3, borderRadius: 3, animation: `${pulse} 2s infinite` }}>
            <Typography variant="h6" fontWeight={700}>
              🔍 AI Prediction Result
            </Typography>

            <Typography sx={{ mt: 1, fontSize: "1.15rem", color: getResultColor(result.label) }}>
              Detected: <strong>{result.label}</strong>
            </Typography>

            <Typography sx={{ mt: 1 }}>
              Confidence: <strong>{result.confidence}%</strong>
            </Typography>

            <LinearProgress
              variant="determinate"
              value={Number(result.confidence)}
              sx={{
                mt: 2,
                height: 12,
                borderRadius: 6,
                backgroundColor: "#f1f5f9",
                "& .MuiLinearProgress-bar": { background: getResultColor(result.label) },
              }}
            />
          </Card>
        </motion.div>
      )}

      {/* history drawer (right) */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 420, p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
            <Box display="flex" gap={1} alignItems="center">
              <Avatar sx={{ bgcolor: "#6a11cb", width: 36, height: 36 }}>
                <HistoryIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight={800}>
                  History
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Previous scans & reports
                </Typography>
              </Box>
            </Box>

            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 1 }} />

          {history.length === 0 ? (
            <Box sx={{ mt: 6, textAlign: "center" }}>
              <Typography color="text.secondary">No previous reports.</Typography>
            </Box>
          ) : (
            <List sx={{ overflowY: "auto", flex: 1, pr: 1 }}>
              {history.map((h) => (
                <ListItem
                  key={h.id}
                  alignItems="flex-start"
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    "&:hover": { bgcolor: "rgba(37,117,252,0.04)", cursor: "pointer" },
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Tooltip title="Download PDF">
                        <IconButton edge="end" onClick={() => downloadPdfReport(h)} size="small">
                          <PictureAsPdfIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton edge="end" onClick={() => confirmAndDelete(h.id)} size="small">
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  }
                  onClick={() => loadHistoryEntry(h)}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={h.preview}
                      sx={{ width: 56, height: 56, border: "1px solid #e6eefc", bgcolor: "#fff" }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography fontWeight={700}>{h.patient.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          • {new Date(h.timestamp).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {h.result.label} — {h.result.confidence}%
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {h.filename}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Divider sx={{ mt: 1 }} />
          <Box sx={{ mt: 2 }}>
            <Button fullWidth variant="outlined" onClick={() => { navigator.clipboard.writeText(JSON.stringify(history)); alert("History JSON copied"); }}>
              Export History (copy JSON)
            </Button>
          </Box>
        </Box>
      </Drawer>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        title="Confirm action"
        message="This operation cannot be undone. Proceed?"
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (typeof confirmAction === "function") confirmAction();
        }}
      />
    </Box>
  );
}




