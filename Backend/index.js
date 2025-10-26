import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dbconnection from "./config/dbconnection.js";
import applicantRoutes from "./routes/applicantRoute.js";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/adminRoute.js";
import commonRoutes from "./routes/commonRoute.js";
import botMimicRoutes from "./routes/botMimicRouter.js";
import { runBotMimic } from "./controllers/botMimicController.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

dbconnection();

app.use("/api/applicant", applicantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/common", commonRoutes);
app.use("/api/bot-mimic", botMimicRoutes);

// Scheduled automatic Bot Mimic every hour
const interval = 60 * 60 * 1000;
setInterval(async () => {
  console.log("Running scheduled Bot Mimic");
  try {
    await runBotMimic();
  } catch (error) {
    console.error("Error running scheduled Bot Mimic:", error.message);
  }
}, interval);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
