import express from "express";
import {
  loginBotMimic,
  logoutBotMimic,
  runBotMimic,
} from "../controllers/botMimicController.js";
import { authenticate, authorizeBot } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginBotMimic);
router.post("/logout", logoutBotMimic);

// Manual trigger for all pending technical applications
router.post("/run", authenticate, authorizeBot, runBotMimic);

// Manual trigger for specific application by ID
router.post("/run/:id", authenticate, authorizeBot, runBotMimic);

export default router;
