import express from "express";
import {
  getTechnicalApplications,
  loginBotMimic,
  logoutBotMimic,
  runBotMimic,
} from "../controllers/botMimicController.js";
import { authenticate, authorizeBot } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", loginBotMimic);
router.post("/logout", logoutBotMimic);


router.post("/run", authenticate, authorizeBot, runBotMimic);


router.post("/run/:id", authenticate, authorizeBot, runBotMimic);

router.get(
  "/technical-applications",
  authenticate,
  authorizeBot,
  getTechnicalApplications
);
export default router;
