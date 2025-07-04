    // /BackEnd/controllers/groqController.js
// import fetch from 'node-fetch';

export async function enhancePromptGroq(req, res) {
  const { prompt } = req.body;
  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return res.status(500).json({ success: false, error: 'Groq API key not set in environment' });
  if (!prompt) return res.status(400).json({ success: false, error: 'Prompt is required' });

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192', // or another Groq-supported model
        messages: [
          { role: 'system', content: 'You are a helpful assistant that rewrites user prompts to be more clear, detailed, and complete.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 256,
        temperature: 0.7,
      }),
    });
    const data = await groqRes.json();
    const enhanced = data?.choices?.[0]?.message?.content || '';
    res.json({ success: true, enhanced });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to call Groq API', details: err.message });
  }
}