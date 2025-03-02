import jwt from "jsonwebtoken";
import users from "../Models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized! because of missing token and barear",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized! because of missing token",
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "fail",
      message: "Unauthorized! just failed",
    });
  }
};

export default auth;
