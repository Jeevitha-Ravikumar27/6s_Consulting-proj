import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: userRole } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;

