import express from "express";
import connect from "./config/db.js";
import dotenv from "dotenv";
import auth from "./MIddleware/authMiddleWare.js";
import AuthRouter from "./routes/AuthRoutes.js";
import AppRouter from "./routes/AppRouter.js";
import bodyParser from "body-parser";
import cors from "cors";
import generate from "./routes/gemini.js";

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use("/app", auth, AppRouter);
app.use("/generate", generate);
app.use("/auth", AuthRouter);

connect().then(() => {
  app.listen(port, () => {
    console.log("Server is running on port 3000");
  });
});
