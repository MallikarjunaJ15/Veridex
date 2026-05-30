import mongoose from "mongoose";
const connectDb = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    return {message:"Internal server error"}
  }
};
export default connectDb;
