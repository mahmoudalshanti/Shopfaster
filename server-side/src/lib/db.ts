import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    if (!process.env.DATABASE_URI)
      throw new Error("DATABASE_URI is not defiend");
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1);
  }
};

export default connectDB;
