// src/pages/Jobs.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token"); // JWT token

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axiosInstance.get("/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApply = async (jobId) => {
    try {
      const res = await axiosInstance.post(
        "/applications",
        { jobId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Application submitted!");
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading jobs...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Available Jobs</h2>
      <div className="row">
        {jobs.length === 0 ? (
          <p>No jobs available currently.</p>
        ) : (
          jobs.map((job) => (
            <div key={job._id} className="col-md-6 mb-4">
              <div className="card shadow p-3">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description}</p>
                <p>
                  <strong>Role Type:</strong> {job.roleType}
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleApply(job._id)}
                >
                  Apply
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
