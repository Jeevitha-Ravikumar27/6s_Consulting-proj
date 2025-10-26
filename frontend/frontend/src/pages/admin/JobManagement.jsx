
import React, { useState, useEffect } from "react";

export default function JobManagement() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    roleType: "technical",
    id: "",
  });
  const [loading, setLoading] = useState(false);

  // const fetchJobs = async () => {
  //   if (!token) return;
  //   try {
  //     const res = await axiosInstance.get("/admin/jobs", {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setJobs(res.data.jobs);
  //   } catch (err) {
  //     console.error(
  //       "Failed to fetch jobs:",
  //       err.response?.data?.message || err
  //     );
  //   }
  // };

  // useEffect(() => {
  //   fetchJobs();
  // }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (form.id) {
        const jobToUpdate = jobs.find((j) => j._id === form.id);
        if (jobToUpdate.roleType === "technical") {
          alert("Technical jobs cannot be updated.");
          setLoading(false);
          return;
        }
        await axiosInstance.put(`/admin/jobs/${form.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axiosInstance.post("/admin/jobs", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ title: "", description: "", roleType: "technical", id: "" });
      fetchJobs();
    } catch (err) {
      console.error("Action failed:", err.response?.data?.message || err);
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
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchJobs();
    } catch (err) {
      console.error("Delete failed:", err.response?.data?.message || err);
      alert("Delete failed");
    }
  };

  const technicalJobs = jobs.filter((j) => j.roleType === "technical");
  const nonTechnicalJobs = jobs.filter((j) => j.roleType === "non-technical");

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
              disabled={form.id && form.roleType === "technical"}
            />
          </div>
          <div className="mb-3">
            <textarea
              className="form-control"
              placeholder="Job Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              disabled={form.id && form.roleType === "technical"}
            />
          </div>
          <div className="mb-3">
            <select
              className="form-select"
              value={form.roleType}
              onChange={(e) => setForm({ ...form, roleType: e.target.value })}
              disabled={form.id}
            >
              <option value="technical">Technical</option>
              <option value="non-technical">Non-Technical</option>
            </select>
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Saving..." : form.id ? "Update Job" : "Create Job"}
          </button>
        </form>
      </div>

      {/* Display Jobs by Category */}
      <h3>Technical Jobs</h3>
      <div className="row mb-4">
        {technicalJobs.map((job) => (
          <div className="col-md-4 mb-3" key={job._id}>
            <div className="card shadow-sm p-3 h-100">
              <h5>{job.title}</h5>
              <p>{job.description}</p>
              <span className="badge bg-success mb-2">{job.roleType}</span>
              <div>
                <button className="btn btn-sm btn-warning me-2" disabled>
                  Edit (read-only)
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

      <h3>Non-Technical Jobs</h3>
      <div className="row mb-4">
        {nonTechnicalJobs.map((job) => (
          <div className="col-md-4 mb-3" key={job._id}>
            <div className="card shadow-sm p-3 h-100">
              <h5>{job.title}</h5>
              <p>{job.description}</p>
              <span className="badge bg-info mb-2">{job.roleType}</span>
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
