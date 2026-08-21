// // src/components/Navbar.jsx
// import React, { useEffect, useState } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Button,
//   Box,
//   Avatar,
//   Menu,
//   MenuItem,
//   IconButton,
//   Drawer
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
// import logo from "../assets/logo.jpg";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const [doctor, setDoctor] = useState(null);
//   const currentPath = useLocation();
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [mobileOpen, setMobileOpen] = useState(false);

//   useEffect(() => {
//     const loadDoctor = () => {
//       const storedDoctor = localStorage.getItem("doctor");
//       setDoctor(storedDoctor ? JSON.parse(storedDoctor) : null);
//     };

//     loadDoctor();

//     window.addEventListener("doctorLogin", loadDoctor);
//     window.addEventListener("doctorSignup", loadDoctor);
//     window.addEventListener("doctorLogout", loadDoctor);
//     window.addEventListener("doctorUpdate", loadDoctor); 

//     return () => {
//       window.removeEventListener("doctorLogin", loadDoctor);
//       window.removeEventListener("doctorSignup", loadDoctor);
//       window.removeEventListener("doctorLogout", loadDoctor);
//       window.removeEventListener("doctorUpdate", loadDoctor);
//     };
//   }, []);

//   const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   const handleLogout = () => {
//     localStorage.removeItem("doctor");
//     window.dispatchEvent(new Event("doctorLogout"));
//     handleMenuClose();
//     navigate("/doctor-login");
//   };

//   const toggleDrawer = () => {
//     setMobileOpen(!mobileOpen);
//   };

//   const navLinks = (
//     <>
//       <RouterLink to="/" style={{ textDecoration: "none" }}>
//         <Button sx={{ color: currentPath.pathname === "/" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
//           Home
//         </Button>
//       </RouterLink>

//       <RouterLink to="/upload" style={{ textDecoration: "none" }}>
//         <Button sx={{ color: currentPath.pathname === "/upload" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
//           Upload
//         </Button>
//       </RouterLink>

//       <RouterLink to="/about" style={{ textDecoration: "none" }}>
//         <Button sx={{ color: currentPath.pathname === "/about" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
//           About
//         </Button>
//       </RouterLink>

//       <RouterLink to="/team" style={{ textDecoration: "none" }}>
//         <Button sx={{ color: currentPath.pathname === "/team" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
//           Team
//         </Button>
//       </RouterLink>

//       <RouterLink to="/contact" style={{ textDecoration: "none" }}>
//         <Button sx={{ color: currentPath.pathname === "/contact" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
//           Contact
//         </Button>
//       </RouterLink>

//       {!doctor && (
//         <>
//           <RouterLink to="/doctor-login" style={{ textDecoration: "none" }}>
//             <Button variant="outlined" sx={{ textTransform: "none", fontWeight: 600 }}>
//               Login
//             </Button>
//           </RouterLink>

//           <RouterLink to="/doctor-signup" style={{ textDecoration: "none" }}>
//             <Button
//               variant="contained"
//               sx={{
//                 background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
//                 color: "white",
//                 fontWeight: "bold",
//                 textTransform: "none",
//                 borderRadius: "20px",
//               }}
//             >
//               Sign Up
//             </Button>
//           </RouterLink>
//         </>
//       )}

//       {doctor && (
//         <>
//          <Avatar
//   src={doctor.avatar || undefined}
//   sx={{ bgcolor: "#3B82F6", cursor: "pointer" }}
//   onClick={handleAvatarClick}
// >
//   {!doctor.avatar && doctor.name.charAt(0).toUpperCase()}
// </Avatar>

//           <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
//             <MenuItem disabled>{doctor.name}</MenuItem>
//             <MenuItem onClick={() => { navigate("/profile"); handleMenuClose(); }}>
//               Profile
//             </MenuItem>
//             <MenuItem onClick={handleLogout}>Logout</MenuItem>
//           </Menu>
//         </>
//       )}
//     </>
//   );

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         sx={{
//           backgroundColor: "white",
//           boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//           padding: "0.5rem 2rem",
//           zIndex: 9999,
//         }}
//       >
//         <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>

//           {/* Logo */}
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <img
//               src={logo}
//               alt="CereScan AI Logo"
//               style={{ width: 35, height: 35, marginRight: 10 }}
//             />
//             <Typography
//               variant="h6"
//               sx={{
//                 fontWeight: "bold",
//                 background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//               }}
//             >
//               CereScan AI
//             </Typography>
//           </Box>

//           {/* Desktop Menu */}
//           <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
//             {navLinks}
//           </Box>

//           {/* Mobile Menu Button */}
//           <IconButton
//             sx={{ display: { xs: "flex", md: "none" } }}
//             onClick={toggleDrawer}
//           >
//             <MenuIcon />
//           </IconButton>
//         </Toolbar>
//       </AppBar>

//       {/* Mobile Drawer */}
//       <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
//         <Box sx={{ width: 250, padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
//           {navLinks}
//         </Box>
//       </Drawer>
//     </>
//   );
// }



import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Drawer,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.jpg";

export default function Navbar() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const currentPath = useLocation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const loadDoctor = () => {
      const storedDoctor = localStorage.getItem("doctor");
      setDoctor(storedDoctor ? JSON.parse(storedDoctor) : null);
    };

    loadDoctor();

    window.addEventListener("doctorLogin", loadDoctor);
    window.addEventListener("doctorSignup", loadDoctor);
    window.addEventListener("doctorLogout", loadDoctor);
    window.addEventListener("doctorUpdate", loadDoctor);

    return () => {
      window.removeEventListener("doctorLogin", loadDoctor);
      window.removeEventListener("doctorSignup", loadDoctor);
      window.removeEventListener("doctorLogout", loadDoctor);
      window.removeEventListener("doctorUpdate", loadDoctor);
    };
  }, []);

  const handleAvatarClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    window.dispatchEvent(new Event("doctorLogout"));
    handleMenuClose();
    navigate("/doctor-login");
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = (
    <>
      <RouterLink to="/" style={{ textDecoration: "none" }}>
        <Button sx={{ color: currentPath.pathname === "/" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
          Home
        </Button>
      </RouterLink>

      <RouterLink to="/upload" style={{ textDecoration: "none" }}>
        <Button sx={{ color: currentPath.pathname === "/upload" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
          Upload
        </Button>
      </RouterLink>

      <RouterLink to="/about" style={{ textDecoration: "none" }}>
        <Button sx={{ color: currentPath.pathname === "/about" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
          About
        </Button>
      </RouterLink>

      <RouterLink to="/team" style={{ textDecoration: "none" }}>
        <Button sx={{ color: currentPath.pathname === "/team" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
          Team
        </Button>
      </RouterLink>

      <RouterLink to="/contact" style={{ textDecoration: "none" }}>
        <Button sx={{ color: currentPath.pathname === "/contact" ? "#3B82F6" : "#374151", fontWeight: 600, textTransform: "none", fontSize: "16px" }}>
          Contact
        </Button>
      </RouterLink>

      {!doctor && (
        <>
          <RouterLink to="/doctor-login" style={{ textDecoration: "none" }}>
            <Button variant="outlined" sx={{ textTransform: "none", fontWeight: 600 }}>
              Login
            </Button>
          </RouterLink>

          <RouterLink to="/doctor-signup" style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
                color: "white",
                fontWeight: "bold",
                textTransform: "none",
                borderRadius: "20px",
              }}
            >
              Sign Up
            </Button>
          </RouterLink>
        </>
      )}

      {doctor && (
        <>
          <Avatar
            src={doctor.avatar || undefined}
            sx={{
              bgcolor: "#3B82F6",
              cursor: "pointer",
              width: 42,
              height: 42,
              border: "2px solid #E0E7FF",
              transition: "transform 0.2s, box-shadow 0.2s",
              "&:hover": {
                transform: "scale(1.05)",
                boxShadow: "0 2px 8px rgba(59,130,246,0.4)",
              },
            }}
            onClick={handleAvatarClick}
          >
            {!doctor.avatar && doctor.name.charAt(0).toUpperCase()}
          </Avatar>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              elevation: 0,
              sx: {
                mt: 1.5,
                minWidth: 230,
                borderRadius: 3,
                overflow: "visible",
                boxShadow: "0px 8px 24px rgba(0,0,0,0.12)",
                border: "1px solid #F1F5F9",
                "& .MuiMenuItem-root": {
                  fontSize: "14.5px",
                  py: 1.2,
                  px: 2.5,
                  borderRadius: 1.5,
                  mx: 1,
                  my: 0.3,
                },
              },
            }}
          >
            {/* Header with avatar + name + email */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2.5, py: 1.5 }}>
              <Avatar
                src={doctor.avatar || undefined}
                sx={{ bgcolor: "#3B82F6", width: 44, height: 44 }}
              >
                {!doctor.avatar && doctor.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box sx={{ overflow: "hidden" }}>
                <Typography sx={{ fontWeight: 700, fontSize: "14.5px", lineHeight: 1.3 }} noWrap>
                  {doctor.name}
                </Typography>
                <Typography sx={{ fontSize: "12.5px", color: "#6B7280" }} noWrap>
                  {doctor.email}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 0.5 }} />

            <MenuItem
              onClick={() => { navigate("/profile"); handleMenuClose(); }}
              sx={{ "&:hover": { bgcolor: "#EFF6FF", color: "#3B82F6" } }}
            >
              <PersonOutlineIcon sx={{ mr: 1.5, fontSize: 20 }} />
              Profile
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              sx={{ color: "#EF4444", "&:hover": { bgcolor: "#FEF2F2" } }}
            >
              <LogoutIcon sx={{ mr: 1.5, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </>
      )}
    </>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: "white",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "0.5rem 2rem",
          zIndex: 9999,
        }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <img
              src={logo}
              alt="CereScan AI Logo"
              style={{ width: 35, height: 35, marginRight: 10 }}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: "bold",
                background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              CereScan AI
            </Typography>
          </Box>

          {/* Desktop Menu */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 2 }}>
            {navLinks}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={toggleDrawer}>
        <Box sx={{ width: 250, padding: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {navLinks}
        </Box>
      </Drawer>
    </>
  );
}