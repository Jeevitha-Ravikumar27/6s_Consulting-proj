import express from "express";
import {
  getCurrentUser,
  getJobById,
  getJobs,
} from "../controllers/commonController.js";

const router = express.Router();

// Get all job postings
router.get("/jobs", getJobs);

// Get job posting by ID
router.get("/jobs/:id", getJobById);

router.get("/current-user", getCurrentUser);

export default router;
