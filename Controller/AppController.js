import QuestionModel from "../Models/QuestionModel.js";
import UserModel from "../Models/userModel.js";

const SaveQuestion = async (req, res) => {
  const { name, questions } = req.body;
  const { userId } = req.params;

  try {
    const newQuestion = new QuestionModel({ name, questions });
    await newQuestion.save();

    const user = await UserModel.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (!Array.isArray(user.Questions)) user.Questions = [];
    user.Questions.push(newQuestion._id);
    await user.save();

    res.status(201).json({ user, message: "Question saved successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetQuestions = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await UserModel.findById(userId).populate({
      path: "Questions",
      options: { sort: { createdAt: -1 } },
    });

    if (!user || !user.Questions) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.Questions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const GetSingleQuestion = async (req, res) => {
  const { questionId } = req.params;
  try {
    const Question = await QuestionModel.findById(questionId);
    if (!Question) {
      return res.status(404).json({ message: "Question doesnt exist" });
    }

    res.status(200).json(Question);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateQuestions = async (req, res) => {
  const { userId, questionId, index } = req.params;
  const { Q, A, Extra } = req.body;

  try {
    // Find the user and populate the Questions field
    const user = await UserModel.findById(userId).populate("Questions");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Find the specific question document
    const questionDoc = await QuestionModel.findById(questionId);
    if (!questionDoc)
      return res.status(404).json({ message: "Question not found" });

    // Ensure the index is valid
    if (!questionDoc.questions[index]) {
      return res.status(400).json({ message: "Invalid question index" });
    }

    // Construct the dynamic update object
    const updateFields = {};
    if (Q) updateFields[`questions.${index}.Q`] = Q;
    if (A) updateFields[`questions.${index}.A`] = A;
    if (Extra) updateFields[`questions.${index}.Extra`] = Extra;

    // Perform the update operation
    const updatedQuestion = await QuestionModel.findByIdAndUpdate(
      questionId,
      { $set: updateFields },
      { new: true }
    );

    res
      .status(200)
      .json({ message: "Question updated successfully", updatedQuestion });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteQuestions = async (req, res) => {
  const { questionId: id } = req.params;

  try {
    const deletedQuestion = await QuestionModel.findByIdAndDelete(id);

    if (!deletedQuestion)
      return res.status(404).json({ message: "Question not found" });

    res.status(200).json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  SaveQuestion,
  GetQuestions,
  updateQuestions,
  deleteQuestions,
  GetSingleQuestion,
};
