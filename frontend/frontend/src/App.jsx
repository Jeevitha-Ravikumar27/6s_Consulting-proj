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
import ManageApplications from "./pages/admin/ManageApplications.jsx";
import ApplicationTimeline from "./pages/applicant/ApplicationTimeline.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ApplyJob from "./pages/applicant/ApplyJob.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ActivityLog from "./pages/admin/ActivityLog.jsx";
import BotDashboard from "./pages/bot/botDashboard.jsx";

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer />
      <Routes>
        {/* Public */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/jobs"
          element={
            <ProtectedRoute role={["applicant", "admin"]}>
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
          path="/admin/activity-log/:applicationId"
          element={
            <ProtectedRoute role={["admin"]}>
              <ActivityLog />
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

        {/* common routes */}
        <Route path="/jobs" element={<Jobs />} />

        {/* Bot routes */}
        <Route
          path="/bot/dashboard"
          element={
            <ProtectedRoute role={["bot"]}>
              <BotDashboard />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
