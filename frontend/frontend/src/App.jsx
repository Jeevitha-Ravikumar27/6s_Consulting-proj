import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Register from "./pages/common/Register.jsx";
import Login from "./pages/common/Login.jsx";
import Jobs from "./pages/common/JobList.jsx";
import MyApplications from "./pages/applicant/MyApplications.jsx";
import ApplicantDashboard from "./pages/applicant/ApplicantDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import JobManagement from "./pages/admin/JobManagement.jsx";
import ManageApplications from "./pages/admin/ManageApplications.jsx";
import ApplicationTimeline from "./pages/applicant/ApplicationTimeline.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ApplyJob from "./pages/applicant/ApplyJob.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Applicant-only */}
        <Route
          path="/jobs"
          element={
            <ProtectedRoute role={["applicant"]}>
              <Jobs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute role={["applicant"]}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/application/:id/timeline"
          element={
            <ProtectedRoute role={["applicant"]}>
              <ApplicationTimeline />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute role={["applicant"]}>
              <ApplicantDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin-only */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/jobs"
          element={
            <ProtectedRoute role={["admin"]}>
              <JobManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/applications"
          element={
            <ProtectedRoute role={["admin"]}>
              <ManageApplications />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:id"
          element={
            <ProtectedRoute role={["applicant"]}>
              <ApplyJob />
            </ProtectedRoute>
          }
        />

        <Route path="/jobs" element={<Jobs />} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
