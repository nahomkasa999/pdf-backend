import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ status: "fail", message: "Email Taken!" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "User Not Found!" });
    }

    const tokenPayload = { id: user._id, email: user.email };
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const userInformation = {
      userId: user._id,
      userName: user.name,
    };
    res.status(200).json({
      status: "success",
      message: "User signed In!",
      data: { accessToken, userInformation },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res
        .status(400)
        .json({ status: "fail", message: "User Not Found!" });
    }

    const isPasswordValid = bcrypt.compare(req.body.password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({ status: "fail", message: "Wrong Password!" });
    }

    const tokenPayload = { id: user._id, email: user.email };
    const accessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const userInformation = {
      userId: user._id,
      userName: user.name,
    };
    res.status(200).json({
      status: "success",
      message: "User Logged In!",
      data: { accessToken, userInformation },
    });
  } catch (err) {
    res.status(500).json({ status: "fail", message: err.message });
  }
};
