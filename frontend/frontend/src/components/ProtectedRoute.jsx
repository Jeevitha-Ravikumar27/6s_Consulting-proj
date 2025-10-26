import React from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";

const ProtectedRoute = ({ children, role }) => {
  const { user, userLoading } = useContext(AuthContext);
  if (userLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (role && !role.includes(user.role)) return <Navigate to="/login" />;

  return children;
};

export default ProtectedRoute;