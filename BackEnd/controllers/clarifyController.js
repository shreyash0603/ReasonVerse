// ReasonVerse-master/BackEnd/controllers/clarifyController.js
// import fetch from 'node-fetch';

export const proxyClarify = async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await fetch('https://thinkvelocity.in/dev/test/clarify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'authorization': 'a1cacd98586a0e974faad626dd85f3f4b4fe120b710686773300f2d8c51d63bf' },
      body: JSON.stringify({ prompt }),
    });
    const data = await response.json();
    // console.log('Refined questions:', data);
    res.status(response.status).json({success: true, data: data});
  } catch (error) {
    res.status(500).json({ error: 'Failed to clarify prompt.' });
  }
};