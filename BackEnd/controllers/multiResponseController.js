// BackEnd/controllers/multiResponseController.js
export const proxyMultiResponse = async (req, res) => {
    try {
      const { prompt, llms } = req.body;
  
      const payload = { prompt, llms };
  
      const response = await fetch('https://thinkvelocity.in/dev/test/api/v1/multiple-response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'a1cacd98586a0e974faad626dd85f3f4b4fe120b710686773300f2d8c51d63bf'
        },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
    //   console.log('Third-party API response:', data);
      res.status(response.status).json({success: true, data: data});
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to proxy multi-response request', details: err.message });
    }
  };