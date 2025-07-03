import OpenAI from "openai";
import dotenv from "dotenv";
import Chat from "../models/chat.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE, // This is critical for Groq
});

export const chatWithAI = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    // Generate two completions (simulate two models or two completions)
    const [response1, response2] = await Promise.all([
      openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "llama3-8b-8192",
        messages: [{ role: "user", content: message }],
        temperature: 0.7,
      }),
      openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "llama3-8b-8192",
        messages: [{ role: "user", content: message }],
        temperature: 1.0, // Slightly different temperature for variety
      })
    ]);

    const reply1 = response1.choices[0].message.content;
    const reply2 = response2.choices[0].message.content;

    // Save both responses to MongoDB
    await Chat.create({ userMessage: message, aiMessage: reply1 });
    await Chat.create({ userMessage: message, aiMessage: reply2 });

    res.json({ success: true, response1: reply1, response2: reply2 });
  } catch (error) {
    console.error("Groq API Error:", error.message);
    res.status(500).json({ error: "Failed to get response from Groq AI" });
  }
};
