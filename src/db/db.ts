import mongoose from "mongoose";
import env from "dotenv";
env.config();

const connectionString = `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.${process.env.MONGO_DB_STRING}.mongodb.net/${process.env.MONGO_DB_DATABASE}`;
const connectToDatabase = async () => {
  try {
    const response = await mongoose.connect(connectionString);

    if (response) {
      console.log("Database connection successful !");
    }
  } catch (error) {
    console.warn(error);
  }
};

export default connectToDatabase;