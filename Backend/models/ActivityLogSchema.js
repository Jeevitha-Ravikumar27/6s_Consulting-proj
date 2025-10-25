import mongoose from "mongoose";

const ActivityLogSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    updatedBy: { type: String, required: true },
    role: { type: String, enum: ["admin", "bot"], required: true },
    action: { type: String, required: true },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.model("ActivityLog", ActivityLogSchema);
