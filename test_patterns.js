import { parseKLFromBillText } from './src/utils/waterBillParser.js';

const screenshotBillText = `
TIRUPATI MUNICIPAL CORPORATION
Water Supply & Sewerage Division
WATER BILL / INVOICE
Bill Date: 15-Mar-2026
Consumer Name: K. Ramaiah
METER READINGS
Description | Meter No. | Previous (KL) | Current (KL) | Consumed (KL) | Read Date
Drinking Water | MTR-TPT-04471 | 3,214 | 3,298 | 84 | 28-Feb-2026
BILLING DETAILS
Water Charges - Slab I (0-10 KL) | Domestic | 5.00 | 10 | 50.00
Water Charges - Slab II (11-25 KL) | Domestic | 10.00 | 15 | 150.00
Water Charges - Slab III (26-50 KL) | Domestic | 18.00 | 25 | 450.00
Water Charges - Slab IV (51-84 KL) | Domestic | 25.00 | 34 | 850.00
`;

const pdfBillText = `
CITY MUNICIPAL WATER AUTHORITY
Water & Sewerage Services Department
BILL DATE 18 Mar 2026
BILLING PERIOD 01 Feb - 28 Feb 2026
CONSUMER NAME Vinay Sai
CONSUMER ID TRP-2024-00471
METER READINGS
Description Previous Reading Current Reading Units Consumed Water (KL)
1,847 1,923 76
BILLING DETAILS
Water Charges (0-10 KL) 10 KL 3.50 / KL 35.00
Water Charges (11-25 KL) 15 KL 8.00 / KL 120.00
Water Charges (26-76 KL) 51 KL 14.00 / KL 714.00
TOTAL AMOUNT DUE Rs. 1,512.42
`;

const runCase = (name, text, expected) => {
  const result = parseKLFromBillText(text);
  console.log(`\n=== ${name} ===`);
  console.log('Expected:', expected);
  console.log('Parsed:', result.kl);
  console.log('Confidence:', result.confidence);
  console.log('Top candidates:', result.candidates.slice(0, 5));
};

const tirupatiOcrLikeText = `
METER READINGS
Drinking Water MTRTPT-04471 224 22% 8 20reb2026
Water Charges - Sab IV (51-84 KL) Domestic 2.00 EF 85000
`;

const ocrMixedYearsAndMeter = `
TIRUPATI MUNICIPAL CORPORATION
Bill Period 2024 2026
3218 3471
`;

runCase('Screenshot bill', screenshotBillText, 84);
runCase('PDF bill', pdfBillText, 76);
runCase('Tirupati-like OCR + Slab IV line', tirupatiOcrLikeText, 84);
runCase('OCR years + meter pair', ocrMixedYearsAndMeter, 253);
