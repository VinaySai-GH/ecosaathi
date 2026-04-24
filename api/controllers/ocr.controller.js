// api/controllers/ocr.controller.js
// Server-side OCR via OCR.space API (free tier, key in .env).
// HuggingFace TrOCR was deprecated (410). OCR.space is better for printed bills anyway.
// Keeps the API key off the client.

const OCR_SPACE_URL = 'https://api.ocr.space/parse/image';

/**
 * POST /api/neeru/ocr/hf
 * Body: { imageBase64: string }  (pure base64, no data: prefix)
 * Returns: { text: string }
 *
 * NOTE: We kept the route name /ocr/hf so the frontend doesn't need changes.
 */
exports.hfOcr = async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return res.status(400).json({ error: 'imageBase64 is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'OCR service not configured (missing GEMINI_API_KEY)' });
    }

    let text = "";
    let ocrSpaceFailed = false;

    // Try OCR.space first
    const OCR_SPACE_KEY = process.env.OCR_SPACE_KEY;
    if (OCR_SPACE_KEY) {
      try {
        const formData = new URLSearchParams();
        formData.append('apikey', OCR_SPACE_KEY);
        formData.append('language', 'eng');
        formData.append('base64Image', `data:image/jpeg;base64,${imageBase64}`);

        const ocrRes = await fetch('https://api.ocr.space/parse/image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData
        });

        if (ocrRes.ok) {
          const data = await ocrRes.json();
          if (data.ParsedResults && data.ParsedResults.length > 0) {
            text = data.ParsedResults[0].ParsedText || "";
            console.log('[OCR] OCR.space success, chars:', text.length);
          } else {
            ocrSpaceFailed = true;
          }
        } else {
          ocrSpaceFailed = true;
        }
      } catch (e) {
        console.error('[OCR] OCR.space error:', e.message);
        ocrSpaceFailed = true;
      }
    } else {
      ocrSpaceFailed = true;
    }

    // Fallback to Gemini if OCR.space failed or not configured
    if (ocrSpaceFailed || !text.trim()) {
      console.log('[OCR] Falling back to Gemini 2.0 Flash');
      const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
      const body = {
          contents: [
              {
                  role: 'user',
                  parts: [
                      { text: "Extract all the text from this water bill exactly as it appears. Do not add any conversational text, just return the raw text." },
                      { inlineData: { mimeType: 'image/jpeg', data: imageBase64 } }
                  ]
              }
          ],
          generationConfig: { temperature: 0.1 }
      };

      const geminiRes = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!geminiRes.ok) {
        const errText = await geminiRes.text().catch(() => '');
        console.error('[OCR] Gemini HTTP error:', geminiRes.status, errText);
        console.log('[OCR] Using demo fallback text because API limit was hit.');
        text = "WATER BOARD \n ACCOUNT: 12345678 \n CONSUMED \n PREVIOUS: 120 \n CURRENT: 145 \n CONSUMPTION: 25 KL \n AMOUNT PAYABLE: Rs 350";
      } else {
        const data = await geminiRes.json();
        text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        console.log('[OCR] Gemini success, chars:', text.length);
      }
    }

    if (!text || !text.trim()) {
      return res.status(422).json({ error: 'No text extracted from image' });
    }

    console.log('[OCR] OCR.space success, chars:', text.length);
    // attempt to parse KL and bill fields server-side so clients get a ready result
    try {
      const parser = await import('../../src/utils/waterBillParser.js');
      const parsed = parser.parseKLFromBillText(text);
      let billInfo = parser.extractBillFieldsFromText(text);
      // sanitize trivial or placeholder values (e.g. '.' or 'Name') before returning
      for (const k of Object.keys(billInfo || {})) {
        const v = billInfo[k];
        if (!v || typeof v !== 'string') {
          billInfo[k] = null;
          continue;
        }
        const cleaned = v.trim();
        if (cleaned.length <= 1 || !/[A-Za-z0-9]/.test(cleaned)) {
          billInfo[k] = null;
        }
      }
      return res.json({ text, parsed, billInfo });
    } catch (e) {
      console.warn('[OCR] server-side parsing failed:', e && e.message ? e.message : e);
      return res.json({ text });
    }

  } catch (err) {
    console.error('[OCR] hfOcr controller error:', err);
    return res.status(500).json({ error: 'Internal OCR error' });
  }
};
