
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export default function ApplicationTimeline() {
  const { id } = useParams();
  const { token } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const fetchApplication = async () => {
  //     try {
  //       const res = await axiosInstance.get(`/applications/${id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setApplication(res.data.application);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchApplication();
  // }, [id, token]);

  const statusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-secondary text-white";
      case "Under Review":
        return "bg-info text-dark";
      case "Approved":
        return "bg-success text-white";
      case "Rejected":
        return "bg-danger text-white";
      default:
        return "bg-light text-dark";
    }
  };

  if (loading)
    return (
      <div className="text-center mt-5">Loading application details...</div>
    );
  if (!application)
    return <div className="text-center mt-5">Application not found</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-3">{application.jobTitle}</h2>
      <p>
        <strong>Role Type:</strong> {application.roleType}
      </p>
      <p>
        <strong>Current Status:</strong>{" "}
        <span className={`badge ${statusColor(application.status)}`}>
          {application.status}
        </span>
      </p>
      <p>
        <strong>Last Updated:</strong>{" "}
        {new Date(application.updatedAt).toLocaleString()}
      </p>

      {application.timeline && application.timeline.length > 0 && (
        <div className="mt-4">
          <h5>Application Timeline:</h5>
          {application.timeline.map((event, index) => (
            <div
              key={index}
              className={`card mb-2 shadow-sm p-3 ${statusColor(event.status)}`}
            >
              <p className="mb-1">
                <strong>Status:</strong> {event.status}
              </p>
              <p className="mb-1">
                <strong>Comment:</strong> {event.comment || "N/A"}
              </p>
              <p className="mb-0 text-muted">
                <strong>Date:</strong>{" "}
                {new Date(event.updatedAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
