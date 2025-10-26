
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";

export default function ApplicantDashboard() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    totalApplied: 0,
    approved: 0,
    rejected: 0,
    underReview: 0,
  });

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const getBadgeClass = (status) => {
    return status === "Approved"
      ? "bg-success"
      : status === "Rejected"
      ? "bg-danger"
      : status === "Under Review"
      ? "bg-warning text-dark"
      : "bg-secondary";
  };

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/applicant/my-applications");
      setApplications(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch applications:",
        error.response?.data?.message || error
      );
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axiosInstance.get("/applicant/application-stats");
      setStats(res.data);
    } catch (error) {
      console.error(
        "Failed to fetch application stats:",
        error.response?.data?.message || error
      );
    }
  };

  console.log(applications);
  console.log(stats);

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [user]);

  const handleRowClick = (appId) => {
    navigate(`/application/${appId}/timeline`);
  };

  return (
    <div className="container my-4">
      {/* Dashboard Title */}
      <h2 className="mb-4 text-primary fw-bold text-center">
        Applicant Dashboard
      </h2>

      {/* Stats Cards */}
      <div className="row g-3 mb-4">
        {[
          {
            title: "Total Applications",
            value: stats.total,
            bg: "info",
          },
          { title: "Approved", value: stats.approved, bg: "success" },
          { title: "Rejected", value: stats.rejected, bg: "danger" },
          {
            title: "Under Review",
            value: stats.underReview,
            bg: "warning",
            textDark: true,
          },
        ].map((card, idx) => (
          <div className="col-12 col-sm-6 col-md-3" key={idx}>
            <div
              className={`card shadow-sm rounded-4 h-100 d-flex flex-column justify-content-center text-center p-3 ${
                card.bg === "warning" && card.textDark
                  ? "text-dark"
                  : "text-white"
              } bg-${card.bg}`}
            >
              <h6 className="mb-2">{card.title}</h6>
              <h3 className="fw-bold">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Applications Table */}
      <div className="row justify-content-center">
  <div className="col-12 col-md-11 col-lg-10">
    <div className="card shadow-sm p-4 rounded-4 mx-auto" style={{ maxWidth: "1000px" }}>
            <h4 className="mb-3 text-center text-secondary">My Applications</h4>
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Job Title</th>
                    <th>Role Type</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Comment</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length ? (
                    applications.map((app) => (
                      <tr
                        key={app._id}
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRowClick(app._id)}
                      >
                        <td>{app.jobId.title}</td>
                        <td className="text-capitalize">{app.roleType}</td>
                        <td>
  <span
    className={`status-badge ${getBadgeClass(app.status)}`}
  >
    {app.status}
  </span>
</td>

                        <td>{new Date(app.updatedAt).toLocaleString()}</td>
                        <td>{app.latestComment || "N/A"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-3">
                        You have not applied to any jobs yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}