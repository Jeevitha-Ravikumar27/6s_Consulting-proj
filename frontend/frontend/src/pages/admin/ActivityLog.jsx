
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

export default function ActivityLog() {
  const { applicationId } = useParams();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await axiosInstance.get(
        `/admin/application/${applicationId}/logs`
      );
      setLogs(res.data.logs);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch activity logs");
      setLoading(false);
    }
  };

  console.log(logs);

  if (loading)
    return <p className="text-center mt-5">Loading activity logs...</p>;

  return (
    <div className="container mt-5 w-75 mx-auto">
      <h2 className="mb-4 text-center">Activity Log</h2>

      <div>
        {logs.length === 0 ? (
          <p className="text-center text-muted">No activity found.</p>
        ) : (
          logs.map((log) => (
            <div key={log._id} className="mb-4 position-relative">
              {/* Log card */}
              <div
                className={`p-3 rounded shadow-sm ${
                  log.role === "admin" ? "bg-light" : "bg-primary text-white"
                }`}
              >
                <div className="d-flex justify-content-between">
                  <strong>{log.updatedBy}</strong>
                  <small>{new Date(log.createdAt).toLocaleString()}</small>
                </div>
                <p className="mb-1">
                  <strong>Action:</strong> {log.action}
                </p>
                {log.comment && (
                  <p className="mb-0">
                    <strong>Comment:</strong> {log.comment}
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

