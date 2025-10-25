import jwt from "jsonwebtoken";
import Job from "../models/JobPostingSchema.js";
import asyncHandler from "../middlewares/asycHandler.js";
import Application from "../models/ApplicationSchema.js";
import ActivityLog from "../models/ActivityLogSchema.js";
import ActivityLogSchema from "../models/ActivityLogSchema.js";

// Admin Login
const adminLogin = asyncHandler((req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate JWT
  const token = jwt.sign({ role: "admin", email }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set JWT in cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Admin logged in" });
});

// Admin Logout
const adminLogout = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Admin logged out" });
});

// Create Job Posting

const createJob = asyncHandler(async (req, res) => {
  try {
    const { title, description, roleType, expirienceLevel } = req.body;

    if (!title || !roleType || !expirienceLevel || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newJob = await Job.create({
      title,
      description,
      roleType,
      expirienceLevel,
      createdBy: req.admin.email,
    });

    res.status(201).json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all applications
const getAllApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate("applicantId", "name email")
    .populate("jobId", "title roleType");

  res.status(200).json(applications);
});

// Update application status and add comments for non-technical roles
const updateApplicationStatus = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;
  const { status, comment } = req.body;

  // Validate status
  const validStatuses = [
    "Applied",
    "Reviewed",
    "Interview",
    "Offer",
    "Hired",
    "Rejected",
  ];
  if (status && !validStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid status value");
  }

  // Find application
  const application = await Application.findById(applicationId);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  if (application.roleType === "technical") {
    res.status(400);
    throw new Error(
      "Manual updates are not allowed for technical applications"
    );
  }

  const oldStatus = application.status;

  // Update application
  if (status) application.status = status;
  if (comment) application.latestComment = comment;
  application.updatedAt = Date.now();

  await application.save();

  // Log the activity
  await ActivityLog.create({
    applicationId: application._id,
    updatedBy: req.admin.email,
    role: "admin",
    action: `Status updated from ${oldStatus} to ${status || oldStatus}`,
    comment: comment || "",
  });

  res.status(200).json({
    message: "Application updated successfully",
    application,
  });
});

// Get application activity log
const getApplicationActivityLog = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;

  // Ensure application exists
  const application = await Application.findById(applicationId);
  if (!application) {
    res.status(404);
    throw new Error("Application not found");
  }

  // Fetch activity logs for this application
  const logs = await ActivityLogSchema.find({ applicationId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    applicationId,
    logs,
  });
});

const getApplicationCountByRoleType = asyncHandler(async (req, res) => {
  const technicalCount = await Application.countDocuments({
    roleType: "technical",
  });
  const nonTechnicalCount = await Application.countDocuments({
    roleType: "non-technical",
  });

  res.status(200).json({
    technical: technicalCount,
    nonTechnical: nonTechnicalCount,
  });
});

export {
  adminLogin,
  adminLogout,
  createJob,
  getAllApplications,
  updateApplicationStatus,
  getApplicationActivityLog,
  getApplicationCountByRoleType,
};
