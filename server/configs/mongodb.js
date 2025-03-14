import mongoose from "mongoose";

// Connect to the MongoDB database

const connectDB = async () => {
  mongoose.connection.on("connected", () =>
    console.log("Database is Connected")
  );

  await mongoose.connect(`${process.env.MONGODB_URI}/techsters-academy`);
};

export default connectDB;
