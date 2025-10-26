import express from "express";
import {
  applyJob,
  createUser,
  getApplicationStats,
  getMyApplications,
  loginUser,
  logoutUser,
} from "../controllers/applicantController.js";
import { authenticate } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

//apply for a job
router.post("/apply", authenticate, applyJob);

//get logged in user's applications
router.get("/my-applications", authenticate, getMyApplications);
export default router;

router.get("/application-stats", authenticate, getApplicationStats);
