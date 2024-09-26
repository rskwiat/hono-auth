import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI!);
    console.log('Connected MongoDB', db.connection.name);
  } catch (error) {
    console.log('error', error)
  }
}

export default connectDB;