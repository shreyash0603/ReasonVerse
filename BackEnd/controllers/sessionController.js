import Session from '../models/session.js';
import Message from '../models/message.js';

// Create a new session
export const createSession = async (req, res) => {
  try {
    const session = new Session({ userId: req.body.userId });
    await session.save();
    res.json({ sessionId: session._id });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create session' });
  }
};

// Save a message
export const saveMessage = async (req, res) => {
  try {
    const { sessionId, role, content } = req.body;
    const message = new Message({ sessionId, role, content });
    await message.save();
    await Session.findByIdAndUpdate(sessionId, { updatedAt: new Date() });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to save message' });
  }
};

// Get all messages for a session
export const getSessionMessages = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const messages = await Message.find({ sessionId }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get messages' });
  }
};

// Get all sessions (optionally for a user)
export const getAllSessions = async (req, res) => {
  const sessions = await Session.find({ userId: req.query.userId || undefined }).sort({ updatedAt: -1 });
  res.json(sessions);
};
