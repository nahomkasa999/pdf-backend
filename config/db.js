import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    return console.log("connnected to db");
  } catch (err) {
    return console.log(err);
  }
};

export default connect;
