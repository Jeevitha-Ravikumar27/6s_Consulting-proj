// src/pages/JobManagement.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export default function JobManagement() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", roleType: "technical", id: "" });
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    try {
      const res = await axiosInstance.get("/admin/jobs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(res.data.jobs);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.id) {
        await axiosInstance.put(`/admin/jobs/${form.id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await axiosInstance.post("/admin/jobs", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
      setForm({ title: "", description: "", roleType: "technical", id: "" });
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Action failed");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (job) => {
    setForm({ ...job });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await axiosInstance.delete(`/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Job Management</h2>

      {/* Job Form */}
      <div className="card shadow-sm p-4 mb-5">
        <h5>{form.id ? "Edit Job" : "Create Job"}</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Job Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Job Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={form.roleType}
              onChange={(e) => setForm({ ...form, roleType: e.target.value })}
            >
              <option value="technical">Technical</option>
              <option value="non-technical">Non-Technical</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Saving..." : form.id ? "Update Job" : "Create Job"}
          </button>
        </form>
      </div>

      {/* Job List */}
      <h3>Existing Jobs</h3>
      <div className="row">
        {jobs.map((job) => (
          <div className="col-md-4 mb-3" key={job._id}>
            <div className="card shadow-sm p-3 h-100">
              <h5>{job.title}</h5>
              <p>{job.description}</p>
              <span
                className={`badge mb-2 ${
                  job.roleType === "technical" ? "bg-success" : "bg-info"
                }`}
              >
                {job.roleType}
              </span>
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEdit(job)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(job._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
