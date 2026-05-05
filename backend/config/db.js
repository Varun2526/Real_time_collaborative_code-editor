import { connect } from "mongoose";

const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB connected");
  } catch (err) {
    console.log("DB error:", err);
    process.exit(1);
  }
};

export default connectDB;