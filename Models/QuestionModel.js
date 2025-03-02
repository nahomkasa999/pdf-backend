import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    questions: [],
    isHiglighted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", QuestionSchema);
export default Question;
