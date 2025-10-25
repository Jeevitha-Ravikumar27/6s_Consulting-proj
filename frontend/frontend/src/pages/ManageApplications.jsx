// src/pages/ManageApplications.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export default function ManageApplications() {
  const [applications, setApplications] = useState([]);

  const fetchApplications = async () => {
    try {
      const res = await axiosInstance.get("/admin/applications", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setApplications(res.data.applications);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdate = async (id, status, comment) => {
    try {
      if (!status) {
        alert("Please select a status before updating.");
        return;
      }
      await axiosInstance.patch(
        `/admin/applications/${id}`,
        { status, comment },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      fetchApplications();
    } catch (err) {
      console.error(err);
      alert("Failed to update application.");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary">Manage Applications</h2>
      <div className="card shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Job Title</th>
              <th>Applicant</th>
              <th>Role Type</th>
              <th>Status</th>
              <th>Update Status</th>
              <th>Comment</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id}>
                <td>{app.jobTitle}</td>
                <td>{app.applicantName}</td>
                <td>{app.roleType}</td>
                <td>{app.status}</td>

                {app.roleType === "non-technical" ? (
                  <>
                    <td>
                      <select
                        className="form-select"
                        onChange={(e) => (app.newStatus = e.target.value)}
                        defaultValue=""
                      >
                        <option value="">Select status</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add comment"
                        onChange={(e) => (app.newComment = e.target.value)}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-success btn-sm"
                        onClick={() =>
                          handleUpdate(app._id, app.newStatus, app.newComment)
                        }
                      >
                        Update
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td colSpan={3} className="text-muted text-center">
                      Automated (Technical)
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
