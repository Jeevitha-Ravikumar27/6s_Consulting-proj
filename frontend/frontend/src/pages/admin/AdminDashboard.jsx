import React, { useEffect, useState, useContext, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import AuthContext from "../../context/AuthContext";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalJobs: 0, technical: 0, nonTechnical: 0 });
  const [applications, setApplications] = useState([]);
  const [editingAppId, setEditingAppId] = useState(null);
  const [activeTab, setActiveTab] = useState("technical");

  const { user, allApplications } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchDashboardData = useCallback(async () => {
    try {
      const resStats = await axiosInstance.get("/admin/application-count");
      setStats(resStats.data);

      const resApps = await axiosInstance.get("/admin/applications");
      setApplications(resApps.data);
    } catch (err) {
      console.error("Failed to fetch admin dashboard:", err.response?.data?.message || err);
    }
  }, []);

  useEffect(() => {
    if (!user) navigate("/login");
    fetchDashboardData();
    allApplications();
  }, [user, fetchDashboardData, navigate, allApplications]);

  const cardStyle = (bgColor) => `card text-white mb-3 shadow-sm ${bgColor}`;

  const roleTypeData = {
    labels: ["Technical", "Non-Technical"],
    datasets: [
      {
        label: "Applications",
        data: [stats.technical, stats.nonTechnical],
        backgroundColor: ["#198754", "#ffc107"],
      },
    ],
  };

  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status ?? "Unknown"] = (acc[app.status ?? "Unknown"] || 0) + 1;
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
    allApplications();
  };

  const filteredApplications = applications.filter((app) => app.roleType === activeTab);

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary fw-bold text-center">Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
        <div className="col">
          <div className={cardStyle("bg-info")}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <h5 className="card-title">Total Jobs</h5>
                <h2 className="card-text">{stats.technical + stats.nonTechnical}</h2>
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
                <h2 className="card-text">{stats.technical}</h2>
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
                <h2 className="card-text">{stats.nonTechnical}</h2>
              </div>
              <FaUserTie size={40} className="opacity-75" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
<div className="d-flex mb-5">
  
  <div style={{ width: "45%" }}>
    <div
      className="card shadow-sm p-3 h-100 d-flex flex-column"
      style={{ backgroundColor: "#f0f0f0" }}
    >
      <h5 className="text-center mb-3">Applications by Role Type</h5>
      <div style={{ flex: 1 }}>
        <Bar
          data={roleTypeData}
          options={{ responsive: true, plugins: { legend: { display: false } } }}
        />
      </div>
    </div>
  </div>

  
  <div style={{ width: "45%", marginLeft: "10%" }}> 
    <div
      className="card shadow-sm p-3 h-100 d-flex flex-column"
      style={{ backgroundColor: "#f0f0f0" }}
    >
      <h5 className="text-center mb-3">Applications Status Distribution</h5>
      <div style={{ flex: 1 }}>
        <Pie data={statusData} options={{ responsive: true }} />
      </div>
    </div>
  </div>
</div>






      {/* Tabs */}
      <div className="d-flex justify-content-center mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "technical" ? "active" : ""}`} onClick={() => setActiveTab("technical")}>
              Technical Roles
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${activeTab === "non-technical" ? "active" : ""}`} onClick={() => setActiveTab("non-technical")}>
              Non-Technical Roles
            </button>
          </li>
        </ul>
      </div>

      {/* Centered Application Table */}
<div className="mb-5">
  <div 
    className="card shadow-sm p-3" 
    style={{ maxWidth: "1200px", margin: "0 auto" }} // <-- centered & wider
  >
    <h4 className="mb-3 text-center">
      {activeTab === "technical" ? "Technical Applications" : "Non-Technical Applications"}
    </h4>
    <div style={{ height: "650px", overflowY: "auto", borderRadius: "10px" }}>
      <table className="table table-hover align-middle text-center">
        <thead className="table-light sticky-top">
          <tr>
            <th>Job</th>
            <th>Applicant</th>
            <th>Role Type</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <React.Fragment key={app._id}>
                <tr onClick={() => navigate(`/admin/activity-log/${app._id}`)} className="cursor-pointer">
                  <td>{app.jobId?.title || "N/A"}</td>
                  <td>{app.applicantId?.name || "N/A"}</td>
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
  style={{
    display: "inline-block",
    width: "110px",      
    textAlign: "center", 
  }}
>
  {app.status}
</span>

                  </td>
                  <td>{new Date(app.updatedAt).toLocaleString()}</td>
                  <td>{app.latestComment || "-"}</td>
                  <td onClick={(e) => e.stopPropagation()}>
                    {app.roleType === "non-technical" ? (
                      <button className="btn btn-sm btn-primary" onClick={() => setEditingAppId(app._id)}>
                        Update
                      </button>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                </tr>
                {editingAppId === app._id && (
  <tr>
    <td colSpan={7}>
      <div style={{ maxWidth: "500px", margin: "10px auto", padding: "15px", border: "1px solid #ddd", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
        <ManageApplications
          app={app}
          onClose={() => setEditingAppId(null)}
          onUpdate={handleUpdate}
        />
      </div>
    </td>
  </tr>
)}

              </React.Fragment>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-muted py-5">
                No applications found for this category.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>


      {/* Create Job Button */}
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
