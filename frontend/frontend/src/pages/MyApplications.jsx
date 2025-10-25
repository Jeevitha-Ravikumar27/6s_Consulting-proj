import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function MyApplications() {
  const { token } = useAuth(); 
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!token) return;

      try {
        const res = await axiosInstance.get("/applicant/my-applications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data.applications);
      } catch (error) {
        console.error("Failed to fetch applications:", error.response?.data?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [token]);

  if (loading) return <div className="text-center mt-5">Loading applications...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Job Applications</h2>
      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        <div className="list-group">
          {applications.map((app) => (
            <Link
              key={app._id}
              to={`/application/${app._id}/timeline`}
              className="list-group-item mb-2 shadow-sm text-decoration-none text-dark"
            >
              <h5>{app.jobId.title}</h5>
              <p>{app.jobId.description}</p>
              <p>Status: <strong>{app.status}</strong></p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
