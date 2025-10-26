
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

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [description, setDescription] = useState("");
  const [roleType, setRoleType] = useState("technical");
  const [experienceLevel, setExperienceLevel] = useState(""); // text input

  useEffect(() => {
    if (!user) navigate("/login");
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const jobsRes = await axiosInstance.get("/common/jobs");
      setJobs(jobsRes.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleApply = async (jobId) => {
    try {
      await axiosInstance.post("/applicant/apply", { jobId });
      toast.success("Application successful");
      myApplications();
    } catch (error) {
      toast.error("Application failed");
    }
  };

  const handleCreateJob = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/admin/create-job", {
        title: jobTitle,
        description,
        roleType,
        expirienceLevel: experienceLevel,
      });
      toast.success("Job created successfully!");
      setShowModal(false);
      setJobTitle("");
      setDescription("");
      setRoleType("technical");
      setExperienceLevel("");
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <p className="text-center mt-5">Loading jobs...</p>;

  return (
    <div className="container mt-5 w-75 mx-auto position-relative">
      {/* Top-right Create Job button (admins only) */}
      {user && user.role === "admin" && (
        <button
          className="btn btn-primary rounded-pill px-4 py-2 shadow-sm position-absolute"
          style={{ top: 0, right: 0, zIndex: 10 }}
          onClick={() => setShowModal(true)}
        >
          Create Job
        </button>
      )}

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

                {user && user.role !== "admin" && (
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
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Job Modal */}
      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Job</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleCreateJob}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Job Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                      style={{ height: "150px", resize: "none" }}
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role Type</label>
                    <select
                      className="form-select"
                      value={roleType}
                      onChange={(e) => setRoleType(e.target.value)}
                    >
                      <option value="technical">Technical</option>
                      <option value="non-technical">Non-Technical</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Experience Level</label>
                    <input
                      type="text"
                      className="form-control"
                      value={experienceLevel}
                      onChange={(e) => setExperienceLevel(e.target.value)}
                      placeholder="eg:1-3 years"
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
