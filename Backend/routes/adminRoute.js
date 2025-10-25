import express from "express";
import {
  adminLogin,
  adminLogout,
  createJob,
  getAllApplications,
  getApplicationActivityLog,
  getApplicationCountByRoleType,
  updateApplicationStatus,
} from "../controllers/adminController.js";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.post("/logout", adminLogout);

// Create a new job posting
router.post("/create-job", authenticate, authorizeAdmin, createJob);

// Get all applications
router.get("/applications", authenticate, authorizeAdmin, getAllApplications);

// Update application status and add comment
router.put(
  "/application/:id",
  authenticate,
  authorizeAdmin,
  updateApplicationStatus
);

// Get application activity log by application ID
router.get(
  "/application/:id/logs",
  authenticate,
  authorizeAdmin,
  getApplicationActivityLog
);

// Get application count by role type
router.get(
  "/application-count",
  authenticate,
  authorizeAdmin,
  getApplicationCountByRoleType
);

export default router;
