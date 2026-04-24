require('dotenv').config();
const fs = require('fs');

const imageBase64 = fs.readFileSync('../tirupati_water_bill (1).png', { encoding: 'base64' });

const apiKey = process.env.GEMINI_API_KEY;

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
fetch(`${GEMINI_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        contents: [{ role: 'user', parts: [
            { text: "Extract all the text from this water bill exactly as it appears. Do not add any conversational text, just return the raw text." },
            { inlineData: { mimeType: 'image/png', data: imageBase64 } }
        ] }]
    })
}).then(res => res.json()).then(data => {
    console.log(JSON.stringify(data, null, 2));
}).catch(console.error);
