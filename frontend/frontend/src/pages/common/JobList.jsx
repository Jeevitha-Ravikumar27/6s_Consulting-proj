
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, applications, myApplications } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
    fetchData();
  }, []);

  console.log(applications);

  const fetchData = async () => {
    try {
      const jobsRes = await axiosInstance.get("/common/jobs");
      setJobs(jobsRes.data);
    } catch (error) {}
  };

  const handleApply = async (jobId) => {
    try {
      const apply = await axiosInstance.post("/applicant/apply", { jobId });
      console.log(apply);

      toast.success("Application successful");
      myApplications();
    } catch (error) {
      toast.error("Application failed");
    }
  };

  // if (loading) return <p className="text-center mt-5">Loading jobs...</p>;

  return (
    <div className="container mt-5 w-75 mx-auto">
      <h2 className="mb-4 text-center">Available Jobs</h2>
      <div className="row">
        {jobs.map((job) => {
          const alreadyApplied = applications.some(
            (app) => app.jobId._id === job._id
          );
          return (
            <div key={job._id} className="col-md-6 mb-4 d-flex">
              <div className="card shadow p-3 flex-fill d-flex flex-column">
                <h5 className="card-title">{job.title}</h5>
                <p className="card-text">{job.description}</p>
                <p>
                  <strong>Role Type:</strong> {job.roleType}
                </p>
                <div className="mt-auto">
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => handleApply(job._id)}
                    disabled={alreadyApplied}
                    title={
                      alreadyApplied ? "You have already applied" : "Apply"
                    }
                  >
                    {alreadyApplied ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

