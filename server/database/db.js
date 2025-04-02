import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./config/config.env" });

/* export const connectDB = async () => 
try{
  await mongoose.connect("process.env.MONGODB_URI", {
      dbName: "MERN STACK LIBRARY MANAGEMENT SYSTEM",
    }).then(() => {
      console.log(`MongoDB connected successfully.`);
    }).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    });
}; */

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "MERN_STACK_LIBRARY_MANAGEMENT_SYSTEM",
    });
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process on failure
  }
};
