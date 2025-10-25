import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token"); // JWT from login
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
  }, []);

  if (loading) return <div className="text-center mt-5">Loading applications...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Job Applications</h2>
      {applications.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        <div className="list-group">
          {applications.map((app) => (
            <div key={app._id} className="list-group-item mb-2 shadow-sm">
              <h5>{app.jobId.title}</h5>
              <p>{app.jobId.description}</p>
              <p>Status: <strong>{app.status}</strong></p>
              <p>Latest Comment: {app.latestComment}</p>
              <p>Role Type: {app.roleType}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
