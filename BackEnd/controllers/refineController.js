// BackEnd/controllers/refineController.js
// import fetch from 'node-fetch';

export const proxyRefine = async (req, res) => {
  try {
    const { prompt, qa_pairs, context } = req.body;

    const payload = {
      prompt,
      qa_pairs,
      context: context || {}
    };

    console.log('Proxying refine with:', payload);

    const response = await fetch('https://thinkvelocity.in/dev/test/refine', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': 'a1cacd98586a0e974faad626dd85f3f4b4fe120b710686773300f2d8c51d63bf'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Refined data', data);
    res.status(response.status).json({success: true, data: data});
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to proxy refine request', details: err.message });
  }
};