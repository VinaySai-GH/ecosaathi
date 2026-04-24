require('dotenv').config();
const fs = require('fs');
const ocrController = require('./controllers/ocr.controller');
const parser = require('../src/utils/waterBillParser');

const imageBase64 = fs.readFileSync('../tirupati_water_bill (1).png', { encoding: 'base64' });

const mockReq = { body: { imageBase64 } };
const mockRes = {
    status: (code) => ({ json: (data) => console.log('STATUS', code, JSON.stringify(data, null, 2)) }),
    json: (data) => console.log('JSON', JSON.stringify(data, null, 2))
};

ocrController.hfOcr(mockReq, mockRes);
