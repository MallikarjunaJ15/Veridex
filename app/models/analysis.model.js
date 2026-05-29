import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  content: { type: String, required: true },
  tier: { type: Number, enum: [1, 2, 3], required: true },
  sourceName: { type: String, default: "Unknown Source" },
});

const claimAnalysisSchema = new mongoose.Schema({
  claimText: { type: String, required: true },
  verdict: {
    type: String,
    enum: ["TRUE", "FALSE", "MISLEADING", "UNVERIFIABLE"],
    required: true,
  },
  confidence: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
    required: true,
  },
  explanation: { type: String, required: true },
  evidence: [evidenceSchema],
});
const analysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    article: {
      type: String,
      required: true,
      trim: true,
    },
    overallVerdict: {
      type: String,
      enum: ["VERIFIED", "FALSE", "MISLEADING", "UNVERIFIABLE"],
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    claims: [claimAnalysisSchema],
    totalSourcesProcessed: { type: Number, default: 0 },
  },
  { timestamps: true },
);
export default mongoose.models.Analysis ||
  mongoose.model("Analysis", analysisSchema);
