import React, { useEffect, useState, useContext } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function BotDashboard() {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();
  const { user, allApplications } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");

    fetchTechnicalApps();
    allApplications();
  }, [loading]);

  const fetchTechnicalApps = async () => {
    try {
      const res = await axiosInstance.get("/bot-mimic/technical-applications");
      setApplications(res.data);
    } catch (err) {
      console.error(
        "Error fetching technical applications:",
        err.response?.data?.message || err.message
      );
    }
  };
  console.log(applications);

  const handleTriggerAll = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post("/bot-mimic/run");
      toast.success(res.data.message);
      fetchTechnicalApps();
    } catch (error) {
      toast.error("Failed to trigger all applications.");
    } finally {
      setLoading(false);
    }
  };

  
  const handleSpecificTrigger = async (applicationId) => {
    try {
      setLoading(true);
      await axiosInstance.post(`/bot-mimic/run/${applicationId}`);
      toast.success("Technical application triggered successfully!");
    } catch (error) {
      toast.error("Failed to trigger technical application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5 position-relative">
      <h2 className="mb-4 text-primary fw-bold text-center">
        Technical Applications
      </h2>

      <div
        className="card shadow-sm p-3 position-relative"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Trigger All button */}
        <button
          className="btn btn-primary rounded-pill px-4 py-2 shadow-sm position-absolute"
          style={{ top: "15px", right: "15px", zIndex: 10 }}
          onClick={handleTriggerAll}
        >
          Trigger All
        </button>

        {loading ? (
          <div className="text-center py-5 fs-5 text-muted">Loading...</div>
        ) : (
          <div
            style={{
              height: "650px",
              overflowY: "auto",
              borderRadius: "10px",
              marginTop: "60px",
            }}
          >
            <table className="table table-hover align-middle text-center">
              <thead className="table-light sticky-top">
                <tr>
                  <th>Job Title</th>
                  <th>Applicant Name</th>
                  <th>Status</th>
                  <th>Last Updated</th>
                  <th>Comment</th>
                  <th>Trigger</th>
                </tr>
              </thead>
              <tbody>
                {applications.length > 0 ? (
                  applications.map((app) => (
                    <tr
                      key={app._id}
                      onClick={() => navigate(`/bot/activity-log/${app._id}`)}
                      className="cursor-pointer"
                    >
                      <td>{app.jobId?.title || "N/A"}</td>
                      <td>{app.applicantId?.name || "N/A"}</td>
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
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleSpecificTrigger(app._id);
                          }}
                        >
                          Trigger
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-muted py-5">
                      No technical applications found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
