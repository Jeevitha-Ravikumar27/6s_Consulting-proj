
import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function ManageApplications({ app, onClose, onUpdate }) {
  const [status, setStatus] = useState(app.status);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!status) return;
    setLoading(true);
    try {
      const res = await axiosInstance.put(`/admin/application/${app._id}`, {
        status,
        comment,
      });
      onUpdate(res.data);
      toast.success("Application updated successfully");
      onClose();
    } catch (err) {
      console.error(
        "Failed to update application:",
        err.response?.data?.message || err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-3 shadow-sm">
      <h5>Update Application: {app.applicantName}</h5>
      <div className="mb-2">
        <label className="form-label">Status</label>
        <select
          className="form-select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={loading}
        >
          <option value="Reviewed">Reviewed</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Hired">Hired</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="mb-2">
        <label className="form-label">Comment</label>
        <textarea
          className="form-control"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          className="btn btn-secondary"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary"
          onClick={handleUpdate}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
