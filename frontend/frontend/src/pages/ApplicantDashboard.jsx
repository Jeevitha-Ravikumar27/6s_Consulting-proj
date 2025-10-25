
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function ApplicantDashboard() {
  const { token } = useAuth(); 
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplied: 0,
    approved: 0,
    rejected: 0,
    underReview: 0,
  });

  const navigate = useNavigate(); 

  const fetchApplications = async () => {
    if (!token) return; 
    try {
      const res = await axiosInstance.get("/applications/my", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplications(res.data.applications);

      const totalApplied = res.data.applications.length;
      const approved = res.data.applications.filter(a => a.status === "Approved").length;
      const rejected = res.data.applications.filter(a => a.status === "Rejected").length;
      const underReview = res.data.applications.filter(a => a.status === "Under Review").length;

      setStats({ totalApplied, approved, rejected, underReview });
    } catch (err) {
      console.error("Failed to fetch applications:", err.response?.data?.message || err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [token]); 

  const getBadgeClass = (status) => {
    return status === "Approved"
      ? "bg-success"
      : status === "Rejected"
      ? "bg-danger"
      : status === "Under Review"
      ? "bg-warning text-dark"
      : "bg-secondary";
  };

  const handleRowClick = (appId) => {
    
    navigate(`/application/${appId}/timeline`);
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary fw-bold">Applicant Dashboard</h2>

      {/* Stats Cards */}
      <div className="row row-cols-1 row-cols-md-4 g-4 mb-5">
        <div className="col">
          <div className="card text-white bg-info shadow-sm p-3">
            <h5>Total Applications</h5>
            <h2>{stats.totalApplied}</h2>
          </div>
        </div>
        <div className="col">
          <div className="card text-white bg-success shadow-sm p-3">
            <h5>Approved</h5>
            <h2>{stats.approved}</h2>
          </div>
        </div>
        <div className="col">
          <div className="card text-white bg-danger shadow-sm p-3">
            <h5>Rejected</h5>
            <h2>{stats.rejected}</h2>
          </div>
        </div>
        <div className="col">
          <div className="card text-dark bg-warning shadow-sm p-3">
            <h5>Under Review</h5>
            <h2>{stats.underReview}</h2>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <h4 className="mb-3">My Applications</h4>
      <div className="card shadow-sm p-3">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Role Type</th>
              <th>Status</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app._id}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(app._id)}
              >
                <td>{app.jobTitle}</td>
                <td>{app.roleType}</td>
                <td>
                  <span className={`badge ${getBadgeClass(app.status)}`}>
                    {app.status}
                  </span>
                </td>
                <td>{new Date(app.updatedAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {applications.length === 0 && <p className="text-center mt-3">You have not applied to any jobs yet.</p>}
      </div>
    </div>
  );
}
