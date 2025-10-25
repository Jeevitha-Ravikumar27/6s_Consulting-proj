import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function ApplyJob() {
  const { id } = useParams(); 
  const { token } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ coverLetter: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchJob = async () => {
      try {
        const res = await axiosInstance.get(`/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJob(res.data.job);
      } catch (err) {
        console.error("Failed to fetch job:", err.response?.data?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      await axiosInstance.post(
        "/applications",
        { jobId: id, ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Application submitted!");
      navigate("/my-applications"); 
    } catch (err) {
      alert(err.response?.data?.message || "Failed to apply");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading job details...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">{job.title}</h2>
      <p>{job.description}</p>
      <p><strong>Role Type:</strong> {job.roleType}</p>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="mb-3">
          <label className="form-label">Cover Letter / Additional Info</label>
          <textarea
            className="form-control"
            rows="5"
            value={form.coverLetter}
            onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
          ></textarea>
        </div>
        <button type="submit" className="btn btn-success">Submit Application</button>
      </form>
    </div>
  );
}
