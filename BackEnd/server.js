import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';
import connectDB from './config/db.js';
// import geminiEnhanceRoutes from './routes/geminiEnhance.js';
import groqEnhanceRoutes from './routes/groqEnhance.js';
import enhancePromptRoutes from './routes/enhancePrompt.js';
import refineRoutes from './routes/refineRoutes.js';
import multiResponseRoutes from './routes/multiResponseRoutes.js';
import clarifyRoutes from './routes/clarifyRoutes.js';
import sessionRoutes from './routes/sessionRoutes.js';
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["http://localhost:9002"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
      "Origin",
      "X-Requested-With",
      "Content-Type",
      "Accept",
      "Authorization",
    ],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  }));


app.use('/api/chat/', chatRoutes);
app.use('/api/auth/', authRoutes);

app.use('/api/groq/', groqEnhanceRoutes);
app.use('/api/enhance/', enhancePromptRoutes);
app.use('/api/refine/', refineRoutes);
app.use('/api/multi-response/', multiResponseRoutes);
app.use('/api/clarify/', clarifyRoutes);
app.use('/api/chat-session/', sessionRoutes);
// app.use('/api/gemini/', geminiEnhanceRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
