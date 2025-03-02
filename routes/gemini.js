import express from "express";
import { generateContent } from "../Controller/GeminiController.js";
const geminiRouter = express.Router();

geminiRouter.post("/gemini", generateContent);

export default geminiRouter;
