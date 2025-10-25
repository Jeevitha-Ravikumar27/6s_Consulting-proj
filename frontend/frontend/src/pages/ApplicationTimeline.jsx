
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function ApplicationTimeline() {
  const { id } = useParams();
  const { token } = useAuth(); 
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!token) return;

    const fetchLogs = async () => {
      try {
        const res = await axiosInstance.get(`/applications/${id}/logs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLogs(res.data.logs);
      } catch (err) {
        console.error("Failed to fetch logs:", err.response?.data?.message || err);
      }
    };

    fetchLogs();
  }, [id, token]); 

  const statusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-secondary";
      case "Under Review":
        return "bg-info";
      case "Approved":
        return "bg-success";
      case "Rejected":
        return "bg-danger";
      default:
        return "bg-light";
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Application Timeline</h2>
      <div className="timeline">
        {logs.length === 0 ? (
          <p className="text-muted">No updates yet.</p>
        ) : (
          logs.map((log, index) => (
            <div
              key={index}
              className={`card mb-3 shadow-sm ${statusColor(log.status)}`}
            >
              <div className="card-body">
                <h5 className="card-title">
                  Status: <strong>{log.status}</strong>
                </h5>
                <p className="mb-1">
                  <strong>Comment:</strong> {log.comment || "N/A"}
                </p>
                <p className="mb-1">
                  <strong>Updated By:</strong> {log.updatedBy}
                </p>
                <p className="text-muted mb-0">
                  <strong>Timestamp:</strong>{" "}
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
