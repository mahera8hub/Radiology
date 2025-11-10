import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, Card, CardContent, Grid, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import BrainIcon from '@mui/icons-material/Psychology';
import SecurityIcon from '@mui/icons-material/Security';
import BoltIcon from '@mui/icons-material/Bolt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function HomePage() {
  const [selectedImage, setSelectedImage] = useState(null);


  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  return (
    <Box sx={{ bgcolor: '#f9fafb', minHeight: '100vh' }}>
      {/* Navbar */}
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: '1px solid #eee' }}>
        <Toolbar>
          <Avatar sx={{ bgcolor: '#e0e7ff', mr: 1 }}>
            <BrainIcon sx={{ color: '#4f46e5' }} />
          </Avatar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600, color: '#4f46e5' }}>
            NeuroScan AI
          </Typography>
          <Button variant="contained" sx={{ bgcolor: '#4f46e5', textTransform: 'none' }}>Remix</Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Brain MRI <span style={{ color: '#4f46e5' }}>Tumor</span> Classifier
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto', mb: 4 }}>
            Upload your MRI scan to detect brain tumor type using advanced artificial intelligence.
            Fast, accurate, and secure analysis powered by cutting-edge machine learning.
          </Typography>

          {/* Upload Button */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
            <Button variant="contained" component="label" sx={{
              background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
              textTransform: 'none',
              px: 3
            }}>
              Upload MRI Scan
              <input hidden accept="image/*" type="file" onChange={handleImageUpload} />
            </Button>
            <Button variant="outlined" sx={{ textTransform: 'none', px: 3 }}>Sign In</Button>
          </Box>

          {/* Uploaded Image Preview */}
          {selectedImage ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Preview:</Typography>
              <Box
                component="img"
                src={selectedImage}
                alt="Uploaded MRI"
                sx={{ width: '100%', maxWidth: 500, borderRadius: 3, boxShadow: 3, mx: 'auto' }}
              />
            </Box>
          ) : (
            <Box
              component="img"
              src="https://cdn.pixabay.com/photo/2017/03/12/13/41/brain-2139197_1280.jpg"
              alt="Brain MRI"
              sx={{ width: '100%', maxWidth: 500, borderRadius: 3, boxShadow: 3, mx: 'auto' }}
            />
          )}
        </motion.div>
      </Container>

      {/* Why Choose Section */}
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" sx={{ textAlign: 'center', fontWeight: 700, mb: 1 }}>
          Why Choose <span style={{ color: '#4f46e5' }}>NeuroScan AI</span>
        </Typography>
        <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary', mb: 6 }}>
          Cutting-edge technology meets medical precision
        </Typography>

        <Grid container spacing={3} justifyContent="center">
          {[{
            icon: <BrainIcon sx={{ color: '#4f46e5' }} />, title: 'Advanced AI Detection', desc: 'Deep learning models trained on thousands of MRI scans.'
          }, {
            icon: <BoltIcon sx={{ color: '#4f46e5' }} />, title: 'Instant Results', desc: 'Get classification results in seconds.'
          }, {
            icon: <SecurityIcon sx={{ color: '#4f46e5' }} />, title: 'HIPAA Compliant', desc: 'Your medical data is fully secure.'
          }].map((item, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: '#e0e7ff', mx: 'auto', mb: 2 }}>{item.icon}</Avatar>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{item.desc}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Detectable Tumor Types */}
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Detectable <span style={{ color: '#4f46e5' }}>Tumor Types</span>
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
          Our AI model can accurately classify multiple tumor types
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {['Glioma', 'Meningioma', 'Pituitary Tumor'].map((type) => (
            <Grid item xs={12} sm={6} md={4} key={type}>
              <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Avatar sx={{ bgcolor: '#e0e7ff', mx: 'auto', mb: 2 }}>
                    <CheckCircleIcon sx={{ color: '#4f46e5' }} />
                  </Avatar>
                  <Typography variant="h6">{type}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Footer */}
      <Box sx={{ bgcolor: '#f1f5f9', py: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          © 2025 NeuroScan AI. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
