import dotenv from "dotenv";
import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import bodyParser from "body-parser";
import cors from "cors";

import generateContent from "./routes/gemini.js";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(clerkMiddleware());
app.use(bodyParser.json());
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/gemini", requireAuth({ signInUrl: "/sign-in" }), generateContent);

app.get("/auth-state", (req, res) => {
  const authState = req.auth;
  return res.json(authState);
});

app.get("/sign-in", (req, res) => {
  // Assuming you have a template engine installed and are using a Clerk JavaScript SDK on this page
  res.render("sign-in");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
