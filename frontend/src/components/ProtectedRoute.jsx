// import React from "react";
// import { Navigate } from "react-router-dom";

// const ProtectedRoute = ({ children }) => {
//   const doctor = JSON.parse(localStorage.getItem("doctor"));

//   if (!doctor) {
//     return <Navigate to="/doctor-signup" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;


import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const doctor = JSON.parse(localStorage.getItem("doctor"));

  if (!doctor) {
    // unauthenticated users should go to login, not signup
    return <Navigate to="/doctor-login" replace />;
  }

  return children;
};

export default ProtectedRoute;
