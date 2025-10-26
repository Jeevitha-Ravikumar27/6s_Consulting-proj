import jwt from "jsonwebtoken";
import asyncHandler from "../middlewares/asycHandler.js";
import Application from "../models/ApplicationSchema.js";
import ActivityLog from "../models/ActivityLogSchema.js";

// Bot Mimic Login
const loginBotMimic = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  if (
    email === process.env.BOT_EMAIL &&
    password === process.env.BOT_PASSWORD
  ) {
    // Generate JWT token
    const token = jwt.sign({ role: "bot", email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const result = { role: "bot", email };

    // Send cookie
    res
      .cookie("jwt", token, {
        
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json(result);
  } else {
    res.status(401);
    throw new Error("Invalid Bot credentials");
  }
});


const logoutBotMimic = asyncHandler(async (req, res) => {
  res
    .cookie("jwt", "", { expires: new Date(0) })
    .status(200)
    .json({ message: "Bot Mimic logged out successfully" });
});

const getTechnicalApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find()
    .populate("applicantId", "name email")
    .populate("jobId", "title roleType");

  
  const technicalApps = applications.filter(
    (app) => app.jobId?.roleType?.toLowerCase() === "technical"
  );

  res.status(200).json(technicalApps);
});

const workflow = [
  "Applied",
  "Reviewed",
  "Interview",
  "Offer",
  "Hired",
  "Rejected",
];

const runBotMimic = asyncHandler(async (req, res) => {
  const applicationId = req.params.id;

  let applications = [];

  if (applicationId) {
    // Run for single application
    const app = await Application.findById(applicationId);
    if (!app) {
      res.status(404);
      throw new Error("Application not found");
    }
    if (app.roleType !== "technical") {
      res.status(400);
      throw new Error("Bot Mimic works only on technical applications");
    }
    applications.push(app);
  } else {
    // Run for all pending technical applications
    applications = await Application.find({
      roleType: "technical",
      status: { $nin: ["Hired", "Rejected"] },
    });

    if (applications.length === 0) {
      return res
        .status(200)
        .json({ message: "No technical applications to update" });
    }
  }

  const updatedApps = [];

  for (const app of applications) {
    const currentIndex = workflow.indexOf(app.status);
    const nextStatus = workflow[currentIndex + 1] || app.status;
    const oldStatus = app.status;

    // Update application
    app.status = nextStatus;
    app.latestComment = `Automatically moved to ${nextStatus}`;
    app.updatedAt = Date.now();
    await app.save();

    // Create individual activity log
    await ActivityLog.create({
      applicationId: app._id,
      updatedBy: "Bot Mimic",
      role: "bot",
      action: `Status updated from ${oldStatus} to ${nextStatus}`,
      comment: app.latestComment,
    });

    updatedApps.push(app);
  }

  res.status(200).json({
    message: applicationId
      ? "Bot Mimic ran for specific application"
      : "Bot Mimic ran for all pending technical applications",
    updatedApplications: updatedApps.length,
  });
});

export { runBotMimic, loginBotMimic, logoutBotMimic, getTechnicalApplications };
