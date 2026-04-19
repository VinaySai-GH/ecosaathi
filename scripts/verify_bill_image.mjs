/**
 * Offline check: Tesseract + waterBillParser on tirupati_water_bill (1).png
 * Run: npm run verify:bill
 */
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { parseKLFromBillText } from '../src/utils/waterBillParser.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const computeScaleForBillOcr = (width, height) => {
  const MIN_SHORT = 960;
  const MAX_LONG = 2400;
  const short = Math.min(width, height);
  const longEdge = Math.max(width, height);
  let scale = 1;
  if (short < MIN_SHORT) scale = MIN_SHORT / short;
  const scaledLong = longEdge * scale;
  if (scaledLong > MAX_LONG) scale *= MAX_LONG / scaledLong;
  return scale;
};

const imagePath = path.join(root, 'tirupati_water_bill (1).png');
if (!fs.existsSync(imagePath)) {
  console.error('Missing:', imagePath);
  process.exit(1);
}

const meta = await sharp(imagePath).metadata();
const scale = computeScaleForBillOcr(meta.width, meta.height);
const w = Math.round(meta.width * scale);
const h = Math.round(meta.height * scale);

const makeBuf = async (contrast, sharpen) => {
  let chain = sharp(imagePath)
    .resize(w, h, { fit: 'fill' })
    .greyscale()
    .linear(contrast, 128 * (1 - contrast));
  if (sharpen) chain = chain.sharpen();
  return chain.jpeg({ quality: 92 }).toBuffer();
};

const variants = [
  ['raw-file', null],
  ['sharp-c1.48', await makeBuf(1.48, false)],
  ['sharp-c1.48-sh', await makeBuf(1.48, true)],
  ['sharp-c1.25', await makeBuf(1.25, false)],
];

const worker = await Tesseract.createWorker('eng');
const psms = ['6', '4', '11'];

let best = { label: '', text: '', kl: null, dist: 9999, conf: 0 };

for (const [label, buf] of variants) {
  for (const psm of psms) {
    await worker.setParameters({
      tessedit_pageseg_mode: String(psm),
      user_defined_dpi: '300',
    });
    const input = buf ?? imagePath;
    const r = await worker.recognize(input);
    const text = r.data.text || '';
    const parsed = parseKLFromBillText(text);
    const kl = parsed.kl;
    const dist = kl == null ? 999 : Math.abs(kl - 84);
    const score = text.length + (text.match(/\d/g) || []).length * 3;
    if (
      dist < best.dist ||
      (dist === best.dist && (parsed.kl != null || score > best.score))
    ) {
      best = {
        label: `${label} psm${psm}`,
        text,
        kl,
        dist,
        conf: r.data.confidence ?? 0,
        score,
        primary: parsed.primaryPattern,
      };
    }
  }
}

await worker.terminate();

console.log('Best variant:', best.label, 'conf:', best.conf?.toFixed?.(0) ?? best.conf);
console.log('Parsed KL:', best.kl, 'primary:', best.primary, '| distance from 84:', best.dist);
console.log('Text length:', best.text?.length);
console.log('\n--- Meter + billing slice ---\n');
const low = best.text.toLowerCase();
const i0 = low.indexOf('meter readings');
const i1 = low.indexOf('payment');
const slice =
  i0 >= 0 ? best.text.slice(i0, i1 > i0 ? i1 : i0 + 900) : best.text.slice(0, 900);
console.log(slice);

const pass = best.kl != null && best.dist <= 8;
console.log('\n', pass ? 'PASS (within 8 of 84 KL)' : 'FAIL');
process.exit(pass ? 0 : 1);
