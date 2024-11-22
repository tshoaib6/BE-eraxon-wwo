import { Request, Response } from 'express'
import OpenAI from 'openai'

// Initialize OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Your OpenAI API key
})

// Controller to handle text generation request
export const generateText = async (req: Request, res: Response) => {
  const { prompt, context } = req.body // Extract prompt and optional context from request body

  if (!prompt) {
    return res.status(400).json({ message: 'Prompt is required' })
  }

  try {
    // Call OpenAI API to generate text based on the prompt
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Using gpt-3.5-turbo
      messages: [
        {
          role: 'system',
          content: `
You are an assistant tasked with enhancing obituary-related content. Your goal is to improve the input text, making it clearer, more compassionate, and easier to understand for a wide audience. Use simple and approachable language, ensuring that anyone can read and connect with the text. Avoid adding new information, but focus on polishing the details provided, particularly in relation to hobbies, interests, life stories, and other obituary-specific details. Ensure that the message remains respectful and empathetic, capturing the essence of the person’s life and legacy. Avoid using technical or overly complex terms and stay true to the original intent. When referring to the individual, use “he” or “she” consistently, based on the context, and ensure the tone remains compassionate and sensitive throughout. The enhanced response should be written in a clear, meaningful paragraph, with sufficient detail to reflect the person’s life, but not too brief.

        `
        },
        { role: 'user', content: prompt } // Send the user's input as-is
      ],
      max_tokens: 300 // Limit the output to 300 tokens

    })

    // Check if the response contains the generated text
    const generatedText = response.choices[0]?.message?.content?.trim()

    if (!generatedText) {
      return res.status(500).json({ message: 'Failed to generate text' })
    }

    return res.status(200).json({
      message: 'Text enhanced successfully',
      generatedText
    })
  } catch (error) {
    console.error('Error generating text:', error)
    return res.status(500).json({ message: 'Failed to enhance text' })
  }
}
