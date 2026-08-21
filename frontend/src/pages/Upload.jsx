
// src/pages/Upload.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Button,
  Typography,
  Card,
  LinearProgress,
  TextField,
  InputAdornment,
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
  ListItemText,
  MenuItem,
  Chip,
} from "@mui/material";
import { styled, keyframes, alpha } from "@mui/system";
import HistoryIcon from "@mui/icons-material/History";
import DeleteIcon from "@mui/icons-material/Delete";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import CloseIcon from "@mui/icons-material/Close";
import BrainIcon from "@mui/icons-material/Psychology";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SearchIcon from "@mui/icons-material/Search";
import ZoomInIcon from "@mui/icons-material/ZoomIn";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import jsPDF from "jspdf";

/* ------------------------------------------------------------------ */
/*  Backend contract — UNCHANGED. Do not modify the request/response  */
/*  shape here; the Django /api/predict/ view expects exactly this.   */
/* ------------------------------------------------------------------ */
const HISTORY_KEY = "mri_analyzer_history_v1";
const PREDICT_ENDPOINT = "http://127.0.0.1:8000/api/predict/";

/* ------------------------------------------------------------------ */
/*  Design tokens — "radiology lightbox" identity.                    */
/*  Clinical paper on the intake side, a dark DICOM-style viewer on   */
/*  the scan side, mono readouts standing in for instrument data.     */
/* ------------------------------------------------------------------ */
const FONT_DISPLAY = '"Space Grotesk", "Poppins", sans-serif';
const FONT_BODY = '"IBM Plex Sans", "Poppins", sans-serif';
const FONT_MONO = '"IBM Plex Mono", "Roboto Mono", monospace';

const COLORS = {
  ink: "#0A0F1C",
  inkElevated: "#101A2E",
  inkLine: "rgba(255,255,255,0.10)",
  paper: "#EEF2F0",
  paperElevated: "#FFFFFF",
  line: "rgba(10,15,28,0.10)",
  lineStrong: "rgba(10,15,28,0.18)",
  cyan: "#2FD9C4",
  cyanSoft: "rgba(47,217,196,0.14)",
  amber: "#F2A93B",
  amberSoft: "rgba(242,169,59,0.16)",
  danger: "#D3543A",
  textPrimary: "#0F1720",
  textMute: "#5B6472",
  textOnInk: "#EAF3F1",
  textOnInkMute: "rgba(234,243,241,0.6)",
};

const PRIMARY_GRADIENT = "linear-gradient(135deg, #0B1220 0%, #163A3E 55%, #1E8F82 100%)";
const PRIMARY_GRADIENT_HOVER = "linear-gradient(135deg, #060A12 0%, #102C30 55%, #17B8A6 100%)";

const scanSweep = keyframes`
  0%   { top: -6%; opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 1; }
  100% { top: 106%; opacity: 0; }
`;



const GradientButton = styled(Button)({
  background: PRIMARY_GRADIENT,
  color: "#fff",
  fontWeight: 700,
  fontFamily: FONT_BODY,
  borderRadius: "12px",
  padding: "11px 26px",
  textTransform: "none",
  boxShadow: "0 10px 24px rgba(10,15,28,0.28)",
  transition: "transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 14px 30px rgba(10,15,28,0.36)",
    background: PRIMARY_GRADIENT_HOVER,
  },
  "&.Mui-disabled": {
    background: "#D7DEEC",
    color: "#9AA5BD",
  },
});

/* Numbered eyebrow — the 01/02/03 reflects the real, fixed order of the
   workflow (patient → scan → result), not decoration. */
const SectionLabel = ({ num, children, tone = "light" }) => (
  <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 1.6 }}>
    <Typography
      sx={{
        fontFamily: FONT_MONO,
        fontSize: "0.72rem",
        fontWeight: 700,
        color: tone === "light" ? COLORS.textMute : COLORS.textOnInkMute,
        opacity: 0.9,
      }}
    >
      {num}
    </Typography>
    <Typography
      sx={{
        fontSize: "0.72rem",
        fontWeight: 800,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        color: tone === "light" ? COLORS.textPrimary : COLORS.textOnInk,
      }}
    >
      {children}
    </Typography>
  </Stack>
);

/* ---------------------------- Confirm Dialog ---------------------------- */
function ConfirmDialog({ open, title, message, onCancel, onConfirm }) {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      PaperProps={{ sx: { borderRadius: 3, p: 0.5, bgcolor: COLORS.paperElevated, color: COLORS.textPrimary } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontFamily: FONT_DISPLAY, color: COLORS.textPrimary }}>{title || "Confirm"}</DialogTitle>
      <DialogContent>
        <Typography sx={{ color: COLORS.textMute }}>{message || "Are you sure?"}</Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onCancel} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/* ----------------------- Custom dial-style gauge ------------------------- */
function ConfidenceDial({ value, tone }) {
  const v = Math.max(0, Math.min(100, Number(value) || 0));
  const size = 128;
  const strokeW = 9;
  const r = (size - strokeW) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const dash = (v / 100) * circumference;
  const ticks = Array.from({ length: 24 });

  return (
    <Box sx={{ position: "relative", width: size, height: size, mx: "auto" }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {ticks.map((_, i) => {
          const angle = (i / ticks.length) * 360;
          const major = i % 6 === 0;
          const inner = r - strokeW / 2 - (major ? 9 : 5);
          const outer = r - strokeW / 2 - 2;
          const rad = ((angle - 90) * Math.PI) / 180;
          const x1 = cx + inner * Math.cos(rad);
          const y1 = cy + inner * Math.sin(rad);
          const x2 = cx + outer * Math.cos(rad);
          const y2 = cy + outer * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={major ? "rgba(15,23,32,0.32)" : "rgba(15,23,32,0.14)"}
              strokeWidth={major ? 1.6 : 1}
            />
          );
        })}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(15,23,32,0.08)" strokeWidth={strokeW} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={strokeW}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${cx} ${cy})`}
          style={{ transition: "stroke-dasharray 0.9s cubic-bezier(.4,0,.2,1)" }}
        />
      </svg>
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography sx={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: "1.5rem", color: COLORS.textPrimary, lineHeight: 1 }}>
          {v}%
        </Typography>
        <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.56rem", letterSpacing: "0.1em", color: COLORS.textMute, mt: 0.4 }}>
          CONFIDENCE
        </Typography>
      </Box>
    </Box>
  );
}

/* ---------------------------- Toast stack -------------------------------- */
function ToastStack({ toasts, onDismiss }) {
  const iconFor = (type) =>
    type === "success" ? (
      <CheckCircleRoundedIcon sx={{ color: COLORS.cyan, fontSize: 20 }} />
    ) : type === "error" ? (
      <ErrorOutlineRoundedIcon sx={{ color: COLORS.amber, fontSize: 20 }} />
    ) : (
      <InfoOutlinedIcon sx={{ color: COLORS.textOnInkMute, fontSize: 20 }} />
    );

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: { xs: 16, sm: 24 },
        left: { xs: 16, sm: "auto" },
        right: { xs: 16, sm: 24 },
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        gap: 1,
        width: { xs: "auto", sm: 340 },
      }}
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.22 }}
          >
            <Box
              onClick={() => onDismiss(t.id)}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.2,
                bgcolor: COLORS.ink,
                color: COLORS.textOnInk,
                borderRadius: 2.5,
                p: "12px 14px",
                boxShadow: "0 14px 34px rgba(10,15,28,0.35)",
                cursor: "pointer",
                border: `1px solid ${COLORS.inkLine}`,
              }}
            >
              {iconFor(t.type)}
              <Typography sx={{ fontSize: "0.85rem", fontFamily: FONT_BODY, lineHeight: 1.4 }}>{t.message}</Typography>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
}

/* ------------------------------ Component -------------------------------- */
export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [toasts, setToasts] = useState([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [crosshair, setCrosshair] = useState({ x: 50, y: 50 });
  const [searchQuery, setSearchQuery] = useState("");
  const [patientId, setPatientId] = useState(null);
  const fileInputRef = useRef(null);

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
  const [confirmMeta, setConfirmMeta] = useState({ title: "", message: "" });
  const [confirmAction, setConfirmAction] = useState(() => () => {});

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

  /* --------------------------------- Toasts -------------------------------- */
  const pushToast = (type, message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  };
  const dismissToast = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  /* ------------------------------- File intake ------------------------------ */
  const processFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setResult(null);
    setErrors((e) => ({ ...e, file: undefined }));
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files && e.target.files[0];
    processFile(selected);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files && e.dataTransfer.files[0];
    if (dropped && dropped.type.startsWith("image/")) {
      processFile(dropped);
    } else if (dropped) {
      pushToast("error", "That file isn't an image. Upload a JPG or PNG MRI slice.");
    }
  };

  const validate = () => {
    const next = {};
    if (!patient.name.trim()) next.name = "Patient name is required";
    if (!patient.age.trim()) next.age = "Age is required";
    else if (Number.isNaN(Number(patient.age)) || Number(patient.age) <= 0) next.age = "Enter a valid age";
    if (!patient.gender) next.gender = "Select a gender";
    if (!file) next.file = "Upload an MRI image to continue";
    setErrors(next);
    if (Object.keys(next).length > 0) {
      pushToast("error", "Fix the highlighted fields before running the prediction.");
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setPatient({ name: "", age: "", gender: "", doctor: "", notes: "" });
    setFile(null);
    setPreview("");
    setResult(null);
    setErrors({});
    setPatientId(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /* ---------------------- Prediction call — UNCHANGED ---------------------- */
  const handleUpload = async () => {
    if (!validate()) return;
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post(PREDICT_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const label = res.data.predicted_class ?? res.data.label ?? "Unknown";
      let confidence = res.data.confidence ?? res.data.probability ?? res.data.prob ?? null;
      if (confidence !== null && confidence !== undefined) {
        confidence =
          Number(confidence) <= 1
            ? (Number(confidence) * 100).toFixed(2)
            : Number(confidence).toFixed(2);
      } else {
        confidence = "0.00";
      }

      const final = { label, confidence };
      setResult(final);

      const newId = `PT-${new Date().getFullYear()}-${String(history.length + 1).padStart(4, "0")}`;
      setPatientId(newId);

      const entry = {
        id: Date.now(),
        patientId: newId,
        timestamp: new Date().toISOString(),
        patient: { ...patient },
        filename: file.name,
        result: final,
        preview,
      };
      const newHistory = [entry, ...history].slice(0, 50);
      setHistory(newHistory);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
      pushToast("success", `Prediction complete — ${label} (${final.confidence}%)`);
    } catch (err) {
      console.error("Prediction error:", err);
      pushToast("error", "Prediction failed. Check that the backend is running.");
    } finally {
      setLoading(false);
    }
  };
  /* -------------------------------------------------------------------------- */

  const downloadPdfReport = (entry = null) => {
    const data = entry
      ? entry
      : {
          timestamp: new Date().toISOString(),
          patient,
          patientId,
          filename: file ? file.name : "image",
          result,
          preview,
        };

    if (!data.result) {
      pushToast("error", "No result to export yet. Run a prediction first.");
      return;
    }

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const margin = 40;
      const pageW = doc.internal.pageSize.getWidth();
      let y = 60;

      doc.setFontSize(18);
      doc.text("MRI — AI Diagnostic Report", margin, y);
      y += 18;
      doc.setFontSize(10);
      doc.setTextColor(90);
      doc.text(`Record ID: ${data.patientId || "—"}`, margin, y);
      y += 14;
      doc.text(`Generated: ${new Date(data.timestamp).toLocaleString()}`, margin, y);
      y += 18;
      doc.setTextColor(20);

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
      doc.setTextColor(120);
      doc.text(
        "Note: AI-assisted report. Clinical correlation required.",
        margin,
        doc.internal.pageSize.getHeight() - 40
      );

      const safeName = (data.patient.name || "patient").replace(/\s+/g, "_");
      doc.save(`MRI_Report_${safeName}_${new Date(data.timestamp).toISOString().slice(0, 19)}.pdf`);
      pushToast("success", "Report downloaded as PDF.");
    } catch (err) {
      console.error(err);
      pushToast("error", "Failed to generate PDF.");
    }
  };

  const copyResultSummary = () => {
    if (!result) return;
    const text = [
      `Record: ${patientId || "—"}`,
      `Patient: ${patient.name} (${patient.age}, ${patient.gender})`,
      `Result: ${result.label}`,
      `Confidence: ${result.confidence}%`,
      `Generated: ${new Date().toLocaleString()}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    pushToast("success", "Result summary copied to clipboard.");
  };

  const exportHistoryCSV = () => {
    if (history.length === 0) {
      pushToast("info", "No history yet to export.");
      return;
    }
    const header = ["Record ID", "Timestamp", "Patient", "Age", "Gender", "Doctor", "Filename", "Result", "Confidence"];
    const rows = history.map((h) => [
      h.patientId || "",
      new Date(h.timestamp).toISOString(),
      h.patient.name,
      h.patient.age,
      h.patient.gender,
      h.patient.doctor || "",
      h.filename,
      h.result.label,
      h.result.confidence,
    ]);
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mri_scan_history.csv";
    a.click();
    URL.revokeObjectURL(url);
    pushToast("success", "History exported as CSV.");
  };

  const loadHistoryEntry = (entry) => {
    setPatient({ ...entry.patient });
    setResult({ ...entry.result });
    setPreview(entry.preview);
    setFile({ name: entry.filename });
    setPatientId(entry.patientId || null);
    setDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const confirmAndDelete = (id) => {
    setConfirmMeta({
      title: "Delete this report?",
      message: "This entry will be permanently removed from history.",
    });
    setConfirmAction(() => () => {
      const newH = history.filter((h) => h.id !== id);
      setHistory(newH);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(newH));
      setConfirmOpen(false);
      pushToast("info", "Report deleted.");
    });
    setConfirmOpen(true);
  };

  const confirmAndClearAll = () => {
    setConfirmMeta({
      title: "Clear all history?",
      message: "All saved reports on this device will be deleted. This cannot be undone.",
    });
    setConfirmAction(() => () => {
      setHistory([]);
      localStorage.removeItem(HISTORY_KEY);
      setConfirmOpen(false);
      pushToast("info", "History cleared.");
    });
    setConfirmOpen(true);
  };

  const isTumor = (label) => !!label && !label.toLowerCase().includes("no tumor");
  const getResultTone = (label) => (isTumor(label) ? COLORS.amber : COLORS.cyan);
  const confidenceBand = (value) => {
    const v = Number(value);
    if (v >= 85) return "High confidence";
    if (v >= 60) return "Moderate confidence";
    return "Low confidence";
  };

  const totalScans = history.length;
  const tumorsFlagged = history.filter((h) => isTumor(h.result.label)).length;

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return history;
    return history.filter(
      (h) =>
        h.patient.name.toLowerCase().includes(q) ||
        (h.result.label || "").toLowerCase().includes(q) ||
        (h.patientId || "").toLowerCase().includes(q)
    );
  }, [history, searchQuery]);

  const handleViewerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCrosshair({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "fit-content",
        bgcolor: COLORS.paper,
        px: { xs: 2, sm: 3, md: 6 },
        py: { xs: 3, md: 5 },
        pb: { xs: 6, md: 8 },
        boxSizing: "border-box",
        overflowX: "hidden",
        fontFamily: FONT_BODY,
      }}
    >
      {/* ---------------------------- HEADER ---------------------------- */}
      <Box
        display="flex"
        flexDirection={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        mb={{ xs: 3, md: 4 }}
      >
        <Box display="flex" alignItems="center" gap={2}>
          {/* <Avatar
            sx={{
              bgcolor: COLORS.ink,
              width: 52,
              height: 52,
              boxShadow: "0 8px 20px rgba(10,15,28,0.32)",
            }}
          >
            <BrainIcon sx={{ color: COLORS.cyan }} fontSize="medium" />
          </Avatar> */}
          <Box>
            <Typography
              sx={{
                fontFamily: FONT_DISPLAY,
                fontWeight: 700,
                fontSize: { xs: "1.4rem", sm: "1.7rem", md: "2rem" },
                color: COLORS.textPrimary,
                lineHeight: 1.15,
              }}
            >
              Brain MRI Detection
            </Typography>
            <Typography variant="body2" sx={{ color: COLORS.textMute, fontSize: { xs: "0.78rem", sm: "0.875rem" } }}>
              Upload MRI — get AI prediction — generate report
            </Typography>
          </Box>
        </Box>

        <Stack direction="row" spacing={1.2} alignItems="center">
          {/* session stats — hidden on very small screens to avoid crowding */}
          <Stack
            direction="row"
            spacing={1}
            sx={{ display: { xs: "none", sm: "flex" } }}
          >
            <Chip
              label={`${totalScans} SCANS`}
              size="small"
              sx={{
                fontFamily: FONT_MONO,
                fontSize: "0.66rem",
                fontWeight: 700,
                bgcolor: COLORS.paperElevated,
                border: `1px solid ${COLORS.line}`,
                color: COLORS.textMute,
              }}
            />
            <Chip
              label={`${tumorsFlagged} FLAGGED`}
              size="small"
              sx={{
                fontFamily: FONT_MONO,
                fontSize: "0.66rem",
                fontWeight: 700,
                bgcolor: tumorsFlagged > 0 ? COLORS.amberSoft : COLORS.paperElevated,
                border: `1px solid ${tumorsFlagged > 0 ? "transparent" : COLORS.line}`,
                color: tumorsFlagged > 0 ? "#8A5A16" : COLORS.textMute,
              }}
            />
          </Stack>

          <Tooltip title="View scan history">
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                border: `1px solid ${COLORS.line}`,
                bgcolor: COLORS.paperElevated,
                width: 46,
                height: 46,
                color: COLORS.ink,
                boxShadow: "0 4px 14px rgba(10,15,28,0.06)",
                "&:hover": { bgcolor: alpha(COLORS.ink, 0.05) },
              }}
            >
              <HistoryIcon />
              {history.length > 0 && (
                <Chip
                  label={history.length}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: -6,
                    right: -6,
                    height: 18,
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    bgcolor: COLORS.cyan,
                    color: "#06231F",
                  }}
                />
              )}
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>

      {/* --------------------------- MAIN GRID --------------------------- */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1.05fr 0.95fr" },
          gap: { xs: 3, md: 4 },
          alignItems: "stretch",
        }}
      >
        {/* -------------------- LEFT: FORM + UPLOAD -------------------- */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Card
            sx={{
              p: { xs: 2.5, md: 3.5 },
              borderRadius: 4,
              border: `1px solid ${COLORS.line}`,
              boxShadow: "0 10px 30px rgba(10,15,28,0.06)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <SectionLabel num="01">Patient Details</SectionLabel>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 2,
                mb: 2,
              }}
            >
              <TextField
                label="Patient Name"
                value={patient.name}
                error={!!errors.name}
                helperText={errors.name}
                onChange={(e) => {
                  setPatient({ ...patient, name: e.target.value });
                  if (errors.name) setErrors((er) => ({ ...er, name: undefined }));
                }}
                fullWidth
              />
              <TextField
                label="Age"
                value={patient.age}
                error={!!errors.age}
                helperText={errors.age}
                onChange={(e) => {
                  setPatient({ ...patient, age: e.target.value });
                  if (errors.age) setErrors((er) => ({ ...er, age: undefined }));
                }}
                fullWidth
              />
              <TextField
                select
                label="Gender"
                value={patient.gender}
                error={!!errors.gender}
                helperText={errors.gender}
                onChange={(e) => {
                  setPatient({ ...patient, gender: e.target.value });
                  if (errors.gender) setErrors((er) => ({ ...er, gender: undefined }));
                }}
                fullWidth
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
              <TextField
                label="Referring Doctor"
                value={patient.doctor}
                onChange={(e) => setPatient({ ...patient, doctor: e.target.value })}
                fullWidth
              />
            </Box>

            <TextField
              label="Notes (symptoms / comments)"
              value={patient.notes}
              onChange={(e) => setPatient({ ...patient, notes: e.target.value })}
              fullWidth
              multiline
              rows={2}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ mb: 3 }} />

            <SectionLabel num="02">MRI Scan</SectionLabel>

            {/* Dropzone */}
            <Box
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => !preview && fileInputRef.current && fileInputRef.current.click()}
              sx={{
                border: `2px dashed ${isDragging ? COLORS.ink : errors.file ? COLORS.danger : COLORS.line}`,
                borderRadius: 3,
                bgcolor: isDragging ? alpha(COLORS.ink, 0.04) : preview ? "#0A0F1C" : alpha(COLORS.ink, 0.02),
                p: preview ? 1.5 : { xs: 3, md: 4 },
                textAlign: "center",
                cursor: preview ? "default" : "pointer",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              <input ref={fileInputRef} hidden accept="image/*" type="file" onChange={handleFileChange} />

              {!preview ? (
                <Stack alignItems="center" spacing={1}>
                  <ImageSearchIcon sx={{ fontSize: 40, color: COLORS.ink, opacity: 0.55 }} />
                  <Typography sx={{ fontWeight: 600, color: COLORS.textPrimary }}>
                    Drag & drop an MRI image, or click to browse
                  </Typography>
                  <Typography variant="caption" sx={{ color: COLORS.textMute }}>
                    JPG or PNG — axial MRI slice recommended
                  </Typography>
                </Stack>
              ) : (
                <Box sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={preview}
                    alt="MRI preview"
                    onClick={() => setLightboxOpen(true)}
                    sx={{
                      width: "100%",
                      height: { xs: 200, md: 280 },
                      objectFit: "contain",
                      borderRadius: 2,
                      cursor: "zoom-in",
                    }}
                  />
                  <Stack direction="row" spacing={0.7} sx={{ position: "absolute", top: 8, right: 8 }}>
                    <Tooltip title="Zoom image">
                      <IconButton
                        size="small"
                        onClick={() => setLightboxOpen(true)}
                        sx={{ bgcolor: "rgba(10,15,28,0.55)", color: "#fff", "&:hover": { bgcolor: "rgba(10,15,28,0.75)" } }}
                      >
                        <ZoomInIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Replace image">
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current && fileInputRef.current.click();
                        }}
                        sx={{ bgcolor: "rgba(10,15,28,0.55)", color: "#fff", "&:hover": { bgcolor: "rgba(10,15,28,0.75)" } }}
                      >
                        <SwapHorizIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Box>
              )}
            </Box>
            {errors.file && (
              <Typography variant="caption" sx={{ color: COLORS.danger, display: "block", mt: 0.7 }}>
                {errors.file}
              </Typography>
            )}

            {file && file.name && (
              <Typography variant="body2" sx={{ mt: 1, fontFamily: FONT_MONO, fontSize: "0.75rem", color: COLORS.textMute }}>
                {file.name}
              </Typography>
            )}

            {loading && (
              <Box sx={{ mt: 2.5 }}>
                <Typography sx={{ fontSize: "0.85rem", color: COLORS.ink, fontWeight: 600, fontFamily: FONT_MONO }}>
                  ANALYZING — CONTACTING MODEL…
                </Typography>
                <LinearProgress
                  sx={{
                    mt: 1,
                    borderRadius: 2,
                    height: 6,
                    bgcolor: alpha(COLORS.ink, 0.08),
                    "& .MuiLinearProgress-bar": { bgcolor: COLORS.cyan },
                  }}
                />
              </Box>
            )}

            <Box sx={{ flexGrow: 1 }} />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} flexWrap="wrap" sx={{ mt: 3 }}>
              <GradientButton onClick={handleUpload} disabled={loading} sx={{ flex: { sm: 1 } }}>
                {loading ? "Analyzing..." : "Predict & Save"}
              </GradientButton>

              <Button
                variant="outlined"
                startIcon={<PictureAsPdfIcon />}
                onClick={() => downloadPdfReport()}
                disabled={!result}
                sx={{
                  textTransform: "none",
                  borderRadius: "12px",
                  borderColor: COLORS.line,
                  color: COLORS.ink,
                  fontWeight: 600,
                }}
              >
                Download PDF
              </Button>

              <Button
                variant="text"
                startIcon={<RestartAltIcon />}
                onClick={resetForm}
                sx={{ textTransform: "none", color: COLORS.textMute }}
              >
                New Scan
              </Button>
            </Stack>
          </Card>
        </motion.div>

        {/* -------------------- RIGHT: DICOM-STYLE VIEWER -------------------- */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.05 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              border: `1px solid ${COLORS.inkLine}`,
              boxShadow: "0 14px 34px rgba(10,15,28,0.22)",
              bgcolor: COLORS.ink,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ p: { xs: 2.5, md: 3 }, pb: 0 }}>
              <SectionLabel num="03" tone="dark">
                AI Result
              </SectionLabel>
            </Box>

            {/* Viewer surface */}
            <Box
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
              onMouseMove={handleViewerMove}
              sx={{
                position: "relative",
                mx: { xs: 2.5, md: 3 },
                borderRadius: 2.5,
                overflow: "hidden",
                bgcolor: "#050810",
                border: `1px solid ${COLORS.inkLine}`,
                height: { xs: 220, sm: 260, md: 300 },
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {preview ? (
                <Box
                  component="img"
                  src={preview}
                  alt="MRI scan"
                  sx={{ width: "100%", height: "100%", objectFit: "contain", opacity: 0.96 }}
                />
              ) : (
                <Stack alignItems="center" spacing={1}>
                  <BrainIcon sx={{ fontSize: 34, color: COLORS.textOnInkMute }} />
                  <Typography sx={{ color: COLORS.textOnInkMute, fontSize: "0.8rem", fontFamily: FONT_MONO }}>
                    NO IMAGE LOADED
                  </Typography>
                </Stack>
              )}

              {/* crosshair reticle */}
              {preview && hovering && (
                <>
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      bottom: 0,
                      left: `${crosshair.x}%`,
                      width: "1px",
                      bgcolor: "rgba(47,217,196,0.55)",
                      pointerEvents: "none",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: `${crosshair.y}%`,
                      height: "1px",
                      bgcolor: "rgba(47,217,196,0.55)",
                      pointerEvents: "none",
                    }}
                  />
                </>
              )}

              {/* scan sweep while analyzing */}
              {loading && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    height: "3px",
                    background: `linear-gradient(90deg, transparent, ${COLORS.cyan}, transparent)`,
                    boxShadow: `0 0 12px 2px ${COLORS.cyan}`,
                    animation: `${scanSweep} 2.1s linear infinite`,
                  }}
                />
              )}

              {/* DICOM-style corner readouts */}
              {preview && (
                <>
                  <Box sx={{ position: "absolute", top: 8, left: 10, pointerEvents: "none" }}>
                    <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.62rem", color: COLORS.textOnInk, lineHeight: 1.5 }}>
                      {patientId || "PT-PENDING"}
                      <br />
                      {patient.name ? patient.name.toUpperCase() : "UNNAMED"}
                    </Typography>
                  </Box>
                  <Box sx={{ position: "absolute", top: 8, right: 10, textAlign: "right", pointerEvents: "none" }}>
                    <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.62rem", color: COLORS.textOnInkMute, lineHeight: 1.5 }}>
                      MRI · AXIAL
                      <br />
                      {new Date().toLocaleDateString()}
                    </Typography>
                  </Box>
                  {result && (
                    <Box sx={{ position: "absolute", bottom: 8, right: 10, textAlign: "right", pointerEvents: "none" }}>
                      <Typography
                        sx={{
                          fontFamily: FONT_MONO,
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: getResultTone(result.label),
                        }}
                      >
                        CONF {result.confidence}%
                      </Typography>
                    </Box>
                  )}
                </>
              )}
            </Box>

            {/* Result readout */}
            <Box sx={{ p: { xs: 2.5, md: 3 }, flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <AnimatePresence mode="wait">
                {result ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={2.5}
                      alignItems="center"
                      justifyContent="center"
                      sx={{ mb: 2 }}
                    >
                      <ConfidenceDial value={result.confidence} tone={getResultTone(result.label)} />
                      <Box sx={{ textAlign: { xs: "center", sm: "left" } }}>
                        <Stack direction="row" spacing={1} alignItems="center" justifyContent={{ xs: "center", sm: "flex-start" }}>
                          {isTumor(result.label) ? (
                            <ErrorOutlineRoundedIcon sx={{ color: COLORS.amber, fontSize: 20 }} />
                          ) : (
                            <CheckCircleRoundedIcon sx={{ color: COLORS.cyan, fontSize: 20 }} />
                          )}
                          <Typography sx={{ fontSize: "1.1rem", fontWeight: 800, color: getResultTone(result.label), fontFamily: FONT_DISPLAY }}>
                            {result.label}
                          </Typography>
                        </Stack>
                        <Chip
                          label={confidenceBand(result.confidence)}
                          size="small"
                          sx={{
                            mt: 1,
                            fontFamily: FONT_MONO,
                            fontSize: "0.65rem",
                            fontWeight: 700,
                            bgcolor: alpha(getResultTone(result.label), 0.16),
                            color: getResultTone(result.label),
                          }}
                        />
                        <Typography variant="caption" sx={{ color: COLORS.textOnInkMute, display: "block", mt: 1 }}>
                          AI-assisted result — clinical correlation required
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={() => downloadPdfReport()}
                        sx={{
                          textTransform: "none",
                          borderRadius: "12px",
                          bgcolor: COLORS.cyan,
                          color: "#06231F",
                          fontWeight: 700,
                          "&:hover": { bgcolor: "#26C4B1" },
                        }}
                      >
                        Download Report
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<ContentCopyIcon />}
                        onClick={copyResultSummary}
                        sx={{
                          textTransform: "none",
                          borderRadius: "12px",
                          borderColor: COLORS.inkLine,
                          color: COLORS.textOnInk,
                          fontWeight: 600,
                          "&:hover": { borderColor: COLORS.cyan, bgcolor: "rgba(47,217,196,0.06)" },
                        }}
                      >
                        Copy Summary
                      </Button>
                    </Stack>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <Box sx={{ textAlign: "center", py: 2 }}>
                      <Typography sx={{ fontWeight: 700, color: COLORS.textOnInk }}>No result yet</Typography>
                      <Typography variant="body2" sx={{ color: COLORS.textOnInkMute, mt: 0.5 }}>
                        Fill in patient details, upload an MRI scan, then run the prediction to see results here.
                      </Typography>
                    </Box>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Card>
        </motion.div>
      </Box>

      {/* --------------------------- IMAGE LIGHTBOX --------------------------- */}
      <Dialog open={lightboxOpen} onClose={() => setLightboxOpen(false)} maxWidth="md" fullWidth>
        <Box sx={{ position: "relative", bgcolor: "#050810" }}>
          <IconButton
            onClick={() => setLightboxOpen(false)}
            sx={{ position: "absolute", top: 8, right: 8, color: "#fff", bgcolor: "rgba(255,255,255,0.08)" }}
          >
            <CloseIcon />
          </IconButton>
          {preview && (
            <Box component="img" src={preview} alt="MRI full view" sx={{ width: "100%", maxHeight: "80vh", objectFit: "contain" }} />
          )}
        </Box>
      </Dialog>

      {/* --------------------------- HISTORY DRAWER --------------------------- */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { bgcolor: COLORS.paperElevated } }}
      >
        <Box
          sx={{
            width: { xs: 300, sm: 380, md: 420 },
            maxWidth: "100vw",
            p: 2.5,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            bgcolor: COLORS.paperElevated,
            color: COLORS.textPrimary,
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
            <Box display="flex" gap={1.5} alignItems="center">
              <Avatar sx={{ bgcolor: COLORS.ink, width: 38, height: 38 }}>
                <HistoryIcon fontSize="small" sx={{ color: COLORS.cyan }} />
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 800, color: COLORS.textPrimary, fontFamily: FONT_DISPLAY }}>History</Typography>
                <Typography variant="caption" sx={{ color: COLORS.textMute }}>
                  Previous scans & reports
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={() => setDrawerOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
            <Chip
              label={`${totalScans} total`}
              size="small"
              sx={{ fontFamily: FONT_MONO, fontSize: "0.68rem", bgcolor: COLORS.paper, color: COLORS.textMute }}
            />
            <Chip
              label={`${tumorsFlagged} flagged`}
              size="small"
              sx={{
                fontFamily: FONT_MONO,
                fontSize: "0.68rem",
                bgcolor: tumorsFlagged > 0 ? COLORS.amberSoft : COLORS.paper,
                color: tumorsFlagged > 0 ? "#8A5A16" : COLORS.textMute,
              }}
            />
          </Stack>

          <TextField
            size="small"
            placeholder="Search by patient or result…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            fullWidth
            sx={{ mb: 1.5 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" sx={{ color: COLORS.textMute }} />
                </InputAdornment>
              ),
            }}
          />

          <Divider sx={{ mb: 1 }} />

          {filteredHistory.length === 0 ? (
            <Box sx={{ mt: 8, textAlign: "center" }}>
              <Typography sx={{ color: COLORS.textMute }}>
                {history.length === 0 ? "No previous reports." : "No matches for that search."}
              </Typography>
            </Box>
          ) : (
            <List sx={{ overflowY: "auto", flex: 1, pr: 0.5 }}>
              {filteredHistory.map((h) => (
                <ListItem
                  key={h.id}
                  alignItems="flex-start"
                  sx={{
                    mb: 1,
                    borderRadius: 2,
                    border: `1px solid ${COLORS.line}`,
                    "&:hover": { bgcolor: alpha(COLORS.ink, 0.03), cursor: "pointer" },
                  }}
                  secondaryAction={
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Tooltip title="Download PDF">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadPdfReport(h);
                          }}
                        >
                          <PictureAsPdfIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          edge="end"
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            confirmAndDelete(h.id);
                          }}
                        >
                          <DeleteIcon fontSize="small" />
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
                      sx={{ width: 52, height: 52, border: `1px solid ${COLORS.line}`, bgcolor: "#fff" }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography sx={{ fontWeight: 700, fontSize: "0.92rem" }}>{h.patient.name}</Typography>
                    }
                    secondary={
                      <Box>
                        <Typography sx={{ fontFamily: FONT_MONO, fontSize: "0.66rem", color: COLORS.textMute, display: "block" }}>
                          {h.patientId || "—"} · {new Date(h.timestamp).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: getResultTone(h.result.label), fontWeight: 600 }}>
                          {h.result.label} — {h.result.confidence}%
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Divider sx={{ mt: 1, mb: 2 }} />
          <Stack spacing={1}>
            <Stack direction="row" spacing={1}>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(history));
                  pushToast("success", "History JSON copied to clipboard.");
                }}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Copy JSON
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={exportHistoryCSV}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Export CSV
              </Button>
            </Stack>
            <Button
              fullWidth
              variant="text"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={confirmAndClearAll}
              disabled={history.length === 0}
              sx={{ textTransform: "none" }}
            >
              Clear All History
            </Button>
          </Stack>
        </Box>
      </Drawer>

      <ConfirmDialog
        open={confirmOpen}
        title={confirmMeta.title}
        message={confirmMeta.message}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          if (typeof confirmAction === "function") confirmAction();
        }}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </Box>
  );
}


