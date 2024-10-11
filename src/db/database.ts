import dotenv from "dotenv";
import mongoose from "mongoose";

import env from "@/env";

async function connectDB() {
  try {
    const db = await mongoose.connect(env.MONGO_URI);
    console.log("Connected MongoDB", db.connection.name);
  }
  catch (error) {
    console.log("error", error);
  }
}

export default connectDB;
