import User from "../models/UserSchema.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import asyncHandler from "../middlewares/asycHandler.js";
import Application from "../models/ApplicationSchema.js";
import JobPosting from "../models/JobPostingSchema.js";

// register
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new Error("Please fill all the fields");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User Already Exists");
  }

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    role: "applicant",
  });

  try {
    await newUser.save();
    createToken(res, newUser._id);

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    throw new Error("Invalid user data");
  }
});

// login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (isPasswordValid) {
      createToken(res, existingUser._id);

      res.status(201).json({
        _id: existingUser._id,
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      });
      return;
    }
  }

  res.status(400).json({ message: "Invalid email or password" });
});

const logoutUser = async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

// Apply for a job
const applyJob = asyncHandler(async (req, res) => {
  const applicantId = req.user._id;
  const { jobId } = req.body;

  if (!jobId) {
    res.status(400);
    throw new Error("Job ID is required");
  }

  // Check if the job exists
  const job = await JobPosting.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error("Job not found");
  }

  // Prevent duplicate applications
  const existingApplication = await Application.findOne({ applicantId, jobId });
  if (existingApplication) {
    res.status(400);
    throw new Error("You have already applied for this job");
  }

  // Create new application
  const newApplication = await Application.create({
    applicantId,
    jobId,
    roleType: job.roleType,
    latestComment: "Application submitted.",
  });

  if (newApplication) {
    res.status(201).json({
      message: "Application submitted successfully",
      application: newApplication,
    });
  } else {
    res.status(400);
    throw new Error("Failed to create application");
  }
});

// viewing all the applications of logged in applicant

const getMyApplications = asyncHandler(async (req, res) => {
  const applicantId = req.user._id;

  const applications = await Application.find({ applicantId }).populate(
    "jobId",
    "title roleType"
  );

  res.status(200).json(applications);
});

const getApplicationStats = async (req, res) => {
  try {
    const applications = await Application.find();

    const underReviewStatuses = ["Applied", "Reviewed", "Interview", "Offer"];

    let total = 0;
    let approved = 0;
    let rejected = 0;
    let underReview = 0;

    applications.forEach((app) => {
      total += 1;

      if (app.status === "Approved" || app.status === "Hired") approved += 1;
      else if (app.status === "Rejected") rejected += 1;
      else if (underReviewStatuses.includes(app.status)) underReview += 1;
    });

    return res.status(200).json({
      total,
      approved,
      rejected,
      underReview,
    });
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {
  createUser,
  loginUser,
  logoutUser,
  applyJob,
  getMyApplications,
  getApplicationStats,
};
