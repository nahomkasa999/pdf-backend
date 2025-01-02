import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

dotenv.config();

const generateContent = async (req, res) => {
  const { Text } = req.body;
  const { userId } = req.auth;

  console.log("got question", userId);

  if (!Text) {
    return res.status(400).json({ error: "Text is required." });
  }

  try {
    const prompt = `Make an neccessary amount of anki like question or flashcard for this paragraph '${Text}.' Your response must be 1. In json form [{Q: The Question, A: The answer, Extra : The portion of the paragraph where you make the question }, {Q: the 2nd Question, A: the 2nd quesitons answer, Extra : The portion of the paragraph where you make the 2nd question}] and so on. let your extra use the same as the paragraph provide, but you must trim were you should only the sentence that you make the question from. Make your question detailed because i am using this to prepare for my exams, I DONT WANT TO MISS ANY KNOWLEDGE OF THE PARAGRAPH. And dont say anything else, just the json`;

    const result = await model.generateContent(prompt);

    const response = result.response;

    const flashcard =
      response?.candidates?.[0]?.content?.parts?.[0]?.text.replace(
        /```json\n|\```/g,
        ""
      );

    if (flashcard) {
      res.json({ flashcard: JSON.parse(flashcard) });
    } else {
      res.status(500).json({
        flashcard: [{ Q: "", A: "", Extra: "" }],
        error: "Failed to generate flashcards. Please try again.",
      });
    }
  } catch (err) {
    if (err.status === 429) {
      res.status(429).json({
        flashcard: [{ Q: "", A: "", Extra: "" }],
        error: "Quota exceeded or too many requests. Please try later.",
      });
    } else {
      res.status(500).json({
        flashcard: [{ Q: "", A: "", Extra: "" }],
        error: "An error occurred while generating content.",
      });
    }
  }
};

export default generateContent;
