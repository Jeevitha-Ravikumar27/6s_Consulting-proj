
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function Jobs() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        
        const resJobs = await axiosInstance.get("/jobs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(resJobs.data.jobs);

        
        const resApps = await axiosInstance.get("/applications/my", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyApplications(resApps.data.applications.map(app => app.jobId));
      } catch (err) {
        console.error("Failed to fetch jobs or applications:", err.response?.data?.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleApply = (jobId) => {
    navigate(`/apply/${jobId}`);
  };

  if (loading) return <p className="text-center mt-5">Loading jobs...</p>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Available Jobs</h2>
      <div className="row">
        {jobs.length === 0 ? (
          <p className="text-center">No jobs available currently.</p>
        ) : (
          jobs.map((job) => {
            const alreadyApplied = myApplications.includes(job._id);
            return (
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
                    disabled={alreadyApplied}
                    title={alreadyApplied ? "You have already applied" : "Apply"}
                  >
                    {alreadyApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}


