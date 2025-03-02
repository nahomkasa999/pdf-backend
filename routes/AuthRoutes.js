import express from "express";
import { login, register } from "../Controller/AuthController.js";
const AuthRouter = express.Router();

AuthRouter.post("/registration", register);
AuthRouter.post("/login", login);

export default AuthRouter;
