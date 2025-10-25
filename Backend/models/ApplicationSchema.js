import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  applicantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobPosting",
    required: true,
  },
  status: {
    type: String,
    enum: ["Applied", "Reviewed", "Interview", "Offer", "Hired", "Rejected"],
    default: "Applied",
  },
  roleType: {
    type: String,
    enum: ["technical", "non-technical"],
    required: true,
  },
  latestComment: { type: String, default: "Application submitted." },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Application", ApplicationSchema);
