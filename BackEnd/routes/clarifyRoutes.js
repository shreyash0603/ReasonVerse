// ReasonVerse-master/BackEnd/routes/clarifyRoutes.js
import express from 'express';
import { proxyClarify } from '../controllers/clarifyController.js';

const router = express.Router();

router.post('/questionClarify', proxyClarify);

export default router;