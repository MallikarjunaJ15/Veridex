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
      enum: ["fake", "real", "misleading"],
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
export default mongoose.model("Analysis", analysisSchema);
