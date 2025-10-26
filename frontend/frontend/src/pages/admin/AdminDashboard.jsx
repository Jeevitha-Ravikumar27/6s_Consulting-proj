
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { FaClipboardList, FaLaptopCode, FaUserTie } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ManageApplications from "./ManageApplications";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    technicalApps: 0,
    nonTechnicalApps: 0,
  });
  const [applications, setApplications] = useState([]);
  const [editingAppId, setEditingAppId] = useState(null);

  // useEffect(() => {
  //   if (!token) return;

  //   const fetchDashboardData = async () => {
  //     try {
  //       const resStats = await axiosInstance.get("/admin/dashboard", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setStats(resStats.data.stats);

  //       const resApps = await axiosInstance.get("/admin/applications", {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setApplications(resApps.data.applications);
  //     } catch (err) {
  //       console.error(
  //         "Failed to fetch admin dashboard:",
  //         err.response?.data?.message || err
  //       );
  //     }
  //   };

  //   fetchDashboardData();
  // }, [token]);

  const cardStyle = (bgColor) => `card text-white mb-3 shadow-sm ${bgColor}`;

  const roleTypeData = {
    labels: ["Technical", "Non-Technical"],
    datasets: [
      {
        label: "Applications",
        data: [stats.technicalApps, stats.nonTechnicalApps],
        backgroundColor: ["#198754", "#ffc107"],
      },
    ],
  };

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const statusData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#0d6efd", "#198754", "#dc3545", "#ffc107"],
      },
    ],
  };

  const handleUpdate = (updatedApp) => {
    setApplications((prev) =>
      prev.map((app) => (app._id === updatedApp._id ? updatedApp : app))
    );
    setEditingAppId(null);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary fw-bold">Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
        <div className="col">
          <div className={cardStyle("bg-info")}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title">Total Jobs</h5>
                <h2 className="card-text">{stats.totalJobs}</h2>
              </div>
              <FaClipboardList size={40} className="opacity-75" />
            </div>
          </div>
        </div>
        <div className="col">
          <div className={cardStyle("bg-success")}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title">Technical Applications</h5>
                <h2 className="card-text">{stats.technicalApps}</h2>
              </div>
              <FaLaptopCode size={40} className="opacity-75" />
            </div>
          </div>
        </div>
        <div className="col">
          <div className={cardStyle("bg-warning")}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title">Non-Technical Applications</h5>
                <h2 className="card-text">{stats.nonTechnicalApps}</h2>
              </div>
              <FaUserTie size={40} className="opacity-75" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="row mb-5">
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="text-center mb-3">Applications by Role Type</h5>
            <Bar
              data={roleTypeData}
              options={{
                responsive: true,
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
        <div className="col-md-6">
          <div className="card shadow-sm p-3">
            <h5 className="text-center mb-3">
              Applications Status Distribution
            </h5>
            <Pie data={statusData} options={{ responsive: true }} />
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div>
        <h4 className="mb-3">Recent Applications</h4>
        <div className="card shadow-sm p-3">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Job</th>
                <th>Applicant</th>
                <th>Role Type</th>
                <th>Status</th>
                <th>Last Updated</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <React.Fragment key={app._id}>
                  <tr>
                    <td>{app.jobTitle}</td>
                    <td>{app.applicantName}</td>
                    <td>{app.roleType}</td>
                    <td>
                      <span
                        className={`badge ${
                          app.status === "Approved"
                            ? "bg-success"
                            : app.status === "Rejected"
                            ? "bg-danger"
                            : app.status === "Under Review"
                            ? "bg-warning"
                            : "bg-secondary"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td>{new Date(app.updatedAt).toLocaleString()}</td>
                    <td>
                      {app.roleType === "non-technical" ? (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setEditingAppId(app._id)}
                        >
                          Update
                        </button>
                      ) : (
                        <span className="text-muted">—</span>
                      )}
                    </td>
                  </tr>
                  {editingAppId === app._id && (
                    <tr>
                      <td colSpan={6}>
                        <ManageApplications
                          app={app}
                          onClose={() => setEditingAppId(null)}
                          onUpdate={handleUpdate}
                        />
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Floating Create Job Button */}
      <Link
        to="/admin/job-management"
        className="btn btn-primary position-fixed"
        style={{
          bottom: "20px",
          right: "20px",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontSize: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        title="Create Job"
      >
        +
      </Link>
    </div>
  );
}
