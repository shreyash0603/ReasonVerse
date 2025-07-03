import express from "express";
import { chatWithAI } from "../controllers/chatController.js";
import Chat from "../models/chat.js";

const router = express.Router();

router.post("/ai-response", chatWithAI);

// Optional: Get chat history
router.get("/history", async (req, res) => {
    try {
      const chats = await Chat.find().sort({ timestamp: -1 });
      res.json({success: true, chats});
    } catch (error) {
      res.status(500).json({ success: false, error: "Failed to fetch history" });
    }
  });

export default router;
