import React, { useEffect, useState } from "react";
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  CircularProgress 
} from "@mui/material";
import axios from "axios";
import api from "../api/axios";

export default function PatientHistory() {
  // Read doctor from localStorage only once
  const [doctor] = useState(() => JSON.parse(localStorage.getItem("doctor") || "null"));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetched, setFetched] = useState(false); // prevent multiple fetches

  useEffect(() => {
    if (!doctor?.id || fetched) return; // stop if already fetched or no doctor

    let mounted = true;

    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get(`/api/doctor/${doctor.id}/history/`);
        if (mounted) {
          setRecords(res.data.records || res.data || []);
          setFetched(true); // mark as fetched
        }
      } catch (err) {
        console.error(err);
        if (mounted) setError("Failed to fetch history.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchHistory();

    return () => { mounted = false; };
  }, [doctor, fetched]); // safe dependencies

  if (!doctor) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Please login first.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" mb={2}>
        Patient History — {doctor.name}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : records.length === 0 ? (
        <Typography>No records yet.</Typography>
      ) : (
        <List>
          {records.map((r, idx) => (
            <ListItem key={r.id || idx} sx={{ mb: 1 }}>
              <Card sx={{ width: "100%" }}>
                <CardContent>
                  <Typography fontWeight={600}>
                    {r.patient_name || "Unknown Patient"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uploaded: {r.created_at ? new Date(r.created_at).toLocaleString() : "-"}
                  </Typography>
                  <Typography sx={{ mt: 1 }}>
                    Prediction: {r.prediction || "N/A"}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ display: "block", mt: 1 }}
                  >
                    Notes: {r.notes || "-"}
                  </Typography>
                </CardContent>
              </Card>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
}
