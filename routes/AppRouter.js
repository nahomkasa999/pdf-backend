import express from "express";
import {
  SaveQuestion,
  GetQuestions,
  updateQuestions,
  deleteQuestions,
  GetSingleQuestion,
} from "../Controller/AppController.js";

const AppRouter = express.Router();

AppRouter.post("/:userId/savequestions", SaveQuestion);
AppRouter.get("/:userId/getquestions", GetQuestions);
AppRouter.get("/:userId/getsinglequestion/:questionId", GetSingleQuestion);
AppRouter.patch("/:userId/updatequestion/:questionId/:index", updateQuestions);
AppRouter.delete("/:userId/questions/:questionId", deleteQuestions);

export default AppRouter;
