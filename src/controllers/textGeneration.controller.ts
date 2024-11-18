import { Request, Response } from "express";
import OpenAI from "openai";

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "abc", // Your OpenAI API key
});
// console.log("api key from env",openai)
// Controller to handle text generation request
export const generateText = async (req: Request, res: Response) => {
  const { prompt } = req.body; // Extract prompt from request body

  if (!prompt) {
    return res.status(400).json({ message: "Prompt is required" });
  }

  try {
    // Call OpenAI API to generate text based on the prompt
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using gpt-3.5-turbo instead of gpt-4
      messages: [
        { role: "user", content: prompt }, // Send the prompt as user input
      ],
    });

    // Check if the response contains the generated text
    const generatedText = response.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      return res.status(500).json({ message: "Failed to generate text" });
    }

    return res.status(200).json({
      message: "Text generated successfully",
      generatedText,
    });
  } catch (error) {
    console.error("Error generating text:", error);
    return res.status(500).json({ message: "Failed to generate text" });
  }
};
