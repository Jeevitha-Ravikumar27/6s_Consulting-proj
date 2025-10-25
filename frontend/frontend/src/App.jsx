import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Jobs from "./pages/JobList";
import MyApplications from "./pages/MyApplications.jsx";
import ApplicantDashboard from "./pages/ApplicantDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import JobManagement from "./pages/JobManagement";
import ManageApplications from "./pages/ManageApplications";
import ApplicationTimeline from "./pages/ApplicationTimeline";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
        <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Applicant-only */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute role="applicant">
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role="applicant">
              <MyApplications />
            </ProtectedRoute>
          }
        />

        <Route path="/application/:id/timeline" element={
          <ProtectedRoute role="applicant">
            <ApplicationTimeline />
          </ProtectedRoute>
        } />

        {/* Applicant-only */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role="applicant">
              <ApplicantDashboard />  
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />

        <Route path="/admin/jobs" element={
          <ProtectedRoute role="admin">
            <JobManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/applications" element={
          <ProtectedRoute role="admin">
            <ManageApplications />
          </ProtectedRoute>
        } />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

