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

    const apiKey = process.env.OCR_SPACE_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'OCR service not configured (missing OCR_SPACE_KEY)' });
    }

    // OCR.space expects a full data URL
    const dataUrl = `data:image/jpeg;base64,${imageBase64}`;

    // Build form body — OCR.space accepts multipart or JSON-like form
    const params = new URLSearchParams();
    params.append('base64Image', dataUrl);
    params.append('language', 'eng');
    params.append('isOverlayRequired', 'false');
    params.append('detectOrientation', 'true');
    params.append('scale', 'true');          // upscale small images for better accuracy
    params.append('OCREngine', '2');          // Engine 2 is better for printed text / bills
    params.append('filetype', 'jpg');

    const ocrRes = await fetch(OCR_SPACE_URL, {
      method: 'POST',
      headers: {
        apikey: apiKey,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!ocrRes.ok) {
      const errText = await ocrRes.text().catch(() => '');
      console.error('[OCR] OCR.space HTTP error:', ocrRes.status, errText);
      return res.status(502).json({ error: `OCR.space error: ${ocrRes.status}` });
    }

    const data = await ocrRes.json();

    // OCR.space returns { ParsedResults: [{ ParsedText: "..." }], IsErroredOnProcessing: bool }
    if (data.IsErroredOnProcessing) {
      const msg = data.ErrorMessage || 'OCR.space processing error';
      console.error('[OCR] OCR.space processing error:', msg);
      return res.status(422).json({ error: msg });
    }

    const text = (data.ParsedResults || [])
      .map((r) => r.ParsedText || '')
      .join('\n')
      .trim();

    if (!text) {
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
