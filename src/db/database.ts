import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

async function connectDB() {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI!);
    console.log("Connected MongoDB", db.connection.name);
  }
  catch (error) {
    console.log("error", error);
  }
}

export default connectDB;
