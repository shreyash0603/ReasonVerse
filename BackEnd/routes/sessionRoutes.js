import express from 'express';
import { createSession, saveMessage, getSessionMessages, getAllSessions } from '../controllers/sessionController.js';

const router = express.Router();

router.post('/session', createSession); // Create a new session
router.post('/message', saveMessage);   // Save a message
router.get('/session/:sessionId/messages', getSessionMessages); // Get all messages for a session
router.get('/sessions', getAllSessions);

export default router;
