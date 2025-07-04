// BackEnd/routes/multiResponseRoutes.js
import { Router } from 'express';
import { proxyMultiResponse } from '../controllers/multiResponseController.js';

const router = Router();

router.post('/multiResponse', proxyMultiResponse);

export default router;