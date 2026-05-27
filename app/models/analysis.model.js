import mongoose from "mongoose";

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
    claim: {
      type: String,
    },
    verdict: {
      type: String,
      enum: ["fake", "real", "misleading", "unverifiable"],
    },
    score: {
      type: Number,
    },
    explanation: {
      type: String,
    },
    resources: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);
export default mongoose.models.Analysis ||
  mongoose.model("Analysis", analysisSchema);
