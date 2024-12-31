import mongoose from "mongoose";

export async function dbConn() {
  try {
    const conn = await mongoose.connect(String(process.env.MONGO_URI));
    console.log("connected to db successfully!");
  } catch (error) {
    throw new Error(error);
  }
}
