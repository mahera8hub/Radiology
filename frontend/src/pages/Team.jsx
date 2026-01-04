

import React from "react";
import { GitHub, LinkedIn, Email } from "@mui/icons-material";
import { Avatar, Box, Grid, Card, CardContent, Typography, IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";



import saumyaImg from "../assets/saumya.jpg";
import anshikaImg from "../assets/Anshika.jpg";
import maheraImg from "../assets/Mahera.jpg";
import aditiImg from "../assets/Aditi.jpg";
import divyanshiImg from "../assets/Divyanshi.jpg";
import kanishkaImg from "../assets/Kanishka.jpg";

const members = [
    { name: "Saumya Kushwaha", role: "Backend & Testing", email: "saumyakushwaha1601@gmail.com", linkedin: "https://www.linkedin.com/in/saumya-kushwaha-691457301", github: "https://github.com/saumya-2005", img: saumyaImg },
    { name: "Anshika Verma", role: "Content & Research", email: "anshikaverma27012@gmail.com", linkedin: "https://www.linkedin.com/in/anshika-42ab42281", github: "https://github.com/anshikaverma-27012-hash", img: anshikaImg },
    { name: "Mahera Kulsoom", role: "Model Training & Documentation", email: "syedmahera8102005@gmail.com", linkedin: "https://www.linkedin.com/in/mahera-kulsoom-43b051291/", github: "https://github.com/mahera8hub", img: maheraImg },
    { name: "Aditi Diwaker", role: "Research & Frontend", email: "staraditi719@gmail.com", linkedin: "https://www.linkedin.com/in/aditi-diwaker-38413a2a6/", github: "https://github.com/staraditi719-svg", img: aditiImg },
    { name: "Divyanshi Shukla", role: "Research & Frontend", email: "divyanshishukla029@gmail.com", linkedin: "https://www.linkedin.com/in/divyanshi-shukla-202b502b7", github: "https://github.com/divyanshishukla029-a11y", img: divyanshiImg },
    { name: "Kanishka Yadav", role: "UI/UX Designer & Frontend", email: "kanishkayadac@gmail.com", linkedin: "https://www.linkedin.com/in/kanishka-yadav-19a818381", github: "https://github.com/kanishka2607", img: kanishkaImg },
];

const StyledCard = styled(Card)(() => ({
    background: "#fff",
    borderRadius: 20,
    padding: 20,
    textAlign: "center",
    boxShadow: "0 8px 25px rgba(61, 45, 45, 0.08)",
    transition: "0.3s",
    '&:hover': { transform: "translateY(-5px)" }
}));

export default function TeamPage() {
    return (
        <Box sx={{ bgcolor: "#f5f7fa", py: 13, px: 3 }}>

            <Typography variant="h3" align="center" sx={{ fontWeight: 800, color: '#2563eb', mb: 6 }}>
                Our Team
            </Typography>

            {/* ---------------- FIRST ROW (3 members) ---------------- */}
            <Grid container spacing={4} justifyContent="center">
                {members.slice(0, 3).map((m) => (
                    <Grid item key={m.name}>
                        <StyledCard sx={{ width: 300 }}>
                            <CardContent>
                                <Avatar src={m.img} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
                                <Typography variant="h6">{m.name}</Typography>
                                <Typography sx={{ color: "#2563eb", fontWeight: 600 }}>{m.role}</Typography>
                                <Typography variant="body2" sx={{ mt: 0.7, color: "#555" }}>{m.email}</Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                                    <IconButton><Email /></IconButton>
                                    <IconButton><LinkedIn /></IconButton>
                                    <IconButton><GitHub /></IconButton>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

            {/* ---------------- SECOND ROW (3 members) ---------------- */}
            <Grid container spacing={4} justifyContent="center" sx={{ mt: 3 }}>
                {members.slice(3, 6).map((m) => (
                    <Grid item key={m.name}>
                        <StyledCard sx={{ width: 300 }}>
                            <CardContent>
                                <Avatar src={m.img} sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
                                <Typography variant="h6">{m.name}</Typography>
                                <Typography sx={{ color: "#2563eb", fontWeight: 600 }}>{m.role}</Typography>
                                <Typography variant="body2" sx={{ mt: 0.7, color: "#555" }}>{m.email}</Typography>

                                <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 2 }}>
                                    <IconButton><Email /></IconButton>
                                    <IconButton><LinkedIn /></IconButton>
                                    <IconButton><GitHub /></IconButton>
                                </Box>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
}
