import express from "express";
import { getJobById, getJobs } from "../controllers/commonController.js";

const router = express.Router();

// Get all job postings
router.get("/jobs", getJobs);

// Get job posting by ID
router.get("/jobs/:id", getJobById);

export default router;
