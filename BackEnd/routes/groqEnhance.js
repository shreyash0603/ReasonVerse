// /BackEnd/routes/groqEnhance.js
import express from 'express';
import { enhancePromptGroq } from '../controllers/groqController.js';

const router = express.Router();
router.post('/genprompt', enhancePromptGroq);
export default router;