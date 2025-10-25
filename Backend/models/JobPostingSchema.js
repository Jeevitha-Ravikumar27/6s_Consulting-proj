import mongoose from "mongoose";

const JobPostingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    roleType: {
      type: String,
      enum: ["technical", "non-technical"],
      required: true,
    },
    expirienceLevel: {
      type: String,
    },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("JobPosting", JobPostingSchema);
