// BackEnd/routes/refine.js
import { Router } from 'express';
import { proxyRefine } from '../controllers/refineController.js';

const router = Router();

router.post('/refdata', proxyRefine);

export default router;