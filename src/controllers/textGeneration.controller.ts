import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key
});

// Controller to handle text generation request
export const generateText = async (req: Request, res: Response) => {
  const { prompt, context } = req.body; // Extract prompt and optional context from request body

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' });
  }

  try {
    // Call OpenAI API to generate text based on the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo
      messages: [
        {
          role: 'system',
          content: `
            You are an assistant enhancing obituary-related content. 
            Your goal is to improve the input text, making it clearer, more compassionate, and easier to understand. 
            Use simple language that anyone can easily read and relate to. 
            Do not add new information—just polish and refine the details provided, focusing on hobbies, interests, life stories, and other obituary-specific details. 
            Avoid using complicated or technical terms and stay true to the original intent of the text.
          `
          
        },
        { role: 'user', content: prompt }, // Send the user's input as-is
      ],
    });

    // Check if the response contains the generated text
    const generatedText = response.choices[0]?.message?.content?.trim();

    if (!generatedText) {
      return res.status(500).json({ message: 'Failed to generate text' });
    }

    return res.status(200).json({
      message: 'Text enhanced successfully',
      generatedText,
    });
  } catch (error) {
    console.error('Error generating text:', error);
    return res.status(500).json({ message: 'Failed to enhance text' });
  }
};
