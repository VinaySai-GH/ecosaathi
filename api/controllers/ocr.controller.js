const axios = require('axios');

// Use microsoft/trocr-base-printed — a proven OCR model on HF Inference API
// that accepts a binary image body and returns { generated_text: "..." }
const HF_MODEL = 'microsoft/trocr-base-printed';
const HF_URL = `https://api-inference.huggingface.co/models/${HF_MODEL}`;

exports.hfOcr = async (req, res) => {
  try {
    const apiKey = process.env.HF_API_KEY;
    if (!apiKey) {
      return res
        .status(500)
        .json({ error: 'Hugging Face API key missing. Add HF_API_KEY to api/.env' });
    }

    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    // Strip the data-URI prefix if present
    const rawBase64 = imageBase64.replace(/^data:[^;]+;base64,/, '');
    if (!rawBase64) {
      return res.status(400).json({ error: 'Invalid base64 image payload' });
    }

    // Convert base64 → binary Buffer for the HF binary image body
    const imageBuffer = Buffer.from(rawBase64, 'base64');

    // HF Inference API for image-classification / image-to-text models:
    // POST the raw image bytes with Content-Type: image/png (or jpeg).
    // The response is: [{ "generated_text": "..." }]
    const response = await axios.post(HF_URL, imageBuffer, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'image/png',
        Accept: 'application/json',
      },
      // wait_for_model = true so we don't get 503 on cold-start
      params: { wait_for_model: true },
      timeout: 120000,
    });

    const payload = response.data;
    let extracted = '';

    if (typeof payload === 'string') {
      extracted = payload;
    } else if (Array.isArray(payload)) {
      // [{ "generated_text": "..." }] — standard image-to-text format
      extracted = payload
        .map((item) => item.generated_text || item.text || JSON.stringify(item))
        .join('\n');
    } else if (payload?.generated_text) {
      extracted = payload.generated_text;
    } else if (payload?.text) {
      extracted = payload.text;
    } else {
      extracted = JSON.stringify(payload);
    }

    return res.json({ text: extracted || '' });
  } catch (error) {
    const errDetail = error.response?.data || error.message || 'unknown';
    console.error('hfOcr error:', errDetail);
    return res.status(500).json({
      error: 'Hugging Face OCR failed',
      details: errDetail,
    });
  }
};
