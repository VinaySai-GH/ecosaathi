require('dotenv').config();
const fs = require('fs');

const imageBase64 = fs.readFileSync('../tirupati_water_bill (1).png', { encoding: 'base64' });
const OCR_SPACE_KEY = process.env.OCR_SPACE_KEY;

const formData = new URLSearchParams();
formData.append('apikey', OCR_SPACE_KEY);
formData.append('language', 'eng');
formData.append('base64Image', `data:image/jpeg;base64,${imageBase64}`);

fetch('https://api.ocr.space/parse/image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData
}).then(res => res.json()).then(data => {
    console.log(data);
}).catch(console.error);
