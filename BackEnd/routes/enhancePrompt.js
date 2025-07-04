import express from 'express';
const router = express.Router();

router.post('/enhance-prompt', async (req, res) => {
  try {
    const response = await fetch('https://thinkvelocity.in/dev/test/enhance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'a1cacd98586a0e974faad626dd85f3f4b4fe120b710686773300f2d8c51d63bf',
      },
      body: JSON.stringify(req.body),
    });
    const data = await response.json();
    res.json({success: true, data: data});
  } catch (err) {
    res.status(500).json({ error: 'Enhance API failed', details: err.message });
  }
});

export default router;