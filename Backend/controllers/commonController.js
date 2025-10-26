import Job from "../models/JobPostingSchema.js";
import User from "../models/UserSchema.js";
import asyncHandler from "../middlewares/asycHandler.js";

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.cookies.jwt; // or decode JWT from cookie
  if (!userId) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  const user = await User.findById(userId).select("-password");
  res.json(user);
});

export { getJobs, getJobById };
