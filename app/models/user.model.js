import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      firstname: {
        type: String,
        required: true,
        trim: true,
      },
      lastname: {
        type: String,
        required: true,
        trim: true,
      },
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      save: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
