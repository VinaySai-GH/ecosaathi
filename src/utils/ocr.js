// OCR Utility for Water Bill Extraction
// Uses Tesseract.js v5+ (local) + HF trocr (server-side) in parallel

import Tesseract, { OEM, setLogging } from 'tesseract.js';
import { apiFetch } from '../api/client.js';
import { extractBillFieldsFromText, parseKLFromBillText } from './waterBillParser.js';

setLogging(false);

let ocrWorker = null;
const OCR_TIMEOUTS = {
  hfFastMs: 25000,
  /** Several preprocess × PSM passes can exceed 30s on slower devices. */
  tesseractMaxMs: 90000,
  hfLateRetryMs: 10000,
};

/** Scale so the shorter side is readable (Tesseract otherwise estimates ~100 DPI and skips most text). */
const computeScaleForBillOcr = (width, height) => {
  const MIN_SHORT = 960;
  const MAX_LONG = 2400;
  const short = Math.min(width, height);
  const longEdge = Math.max(width, height);
  let scale = 1;
  if (short < MIN_SHORT) {
    scale = MIN_SHORT / short;
  }
  const scaledLong = longEdge * scale;
  if (scaledLong > MAX_LONG) {
    scale *= MAX_LONG / scaledLong;
  }
  return scale;
};

/** Enough cues that this is bill text (OCR often garbles header words). */
const ocrTextHasMinimumBillSignals = (text) => {
  const t = String(text || '');
  const u = t.toUpperCase();
  const digitCount = (t.match(/\d/g) || []).length;
  const len = t.trim().length;
  const hasStructure =
    /METER|READING|CONSUMED|CONSUMPTION|BILLING|CHARGES?|PREVIOUS|CURRENT|UNITS|\(KL|KILOLIT|TIRUPAT|TRUPAT|MUNICIP|MUNCIP|CORPORAT|CONSUMER|WARD|INVOICE|SUPPLY|SEWERAGE|DOMESTIC|ADDRESS|AMOUNT|PAYABLE|\bKL\b/i.test(
      u,
    );
  if (hasStructure && (digitCount >= 4 || len >= 85)) return true;
  if (digitCount >= 7 && len >= 38) return true;
  return false;
};

/** When no KL parses yet, prefer the OCR pass that actually found digits and body text. */
const scoreOcrTextRichness = (text) => {
  const t = String(text || '').trim();
  if (!t) return 0;
  const digits = (t.match(/\d/g) || []).length;
  const lines = (t.match(/\n/g) || []).length + 1;
  let s = Math.min(60, t.length * 0.12);
  s += Math.min(50, digits * 1.8);
  s += Math.min(25, lines * 1.5);
  if (/\d{2,}/.test(t)) s += 12;
  if (ocrTextHasMinimumBillSignals(t)) s += 80;
  return s;
};

/** Prefer OCR text that parses to a labeled consumption row over raw meter diffs. */
const scoreParsedBillQuality = (parsed) => {
  if (!parsed || parsed.kl == null) return 0;
  const p = parsed.primaryPattern;
  const rank = {
    table_row_consumed_cell: 108,
    table_consumed_column: 100,
    table_stacked_readings: 96,
    table_triplet_readings: 94,
    billing_slab_iv_span: 92,
    consumption_label: 88,
    value_before_kl: 55,
    cubic_meter_value: 50,
    table_meter_sorted_pair: 41,
    meter_reading_diff: 34,
    meter_pair_diff: 33,
    raw_number: 20,
    digit_token: 15,
  };
  let s = rank[p] ?? 28;
  if (parsed.guessed) s -= 8;
  return s;
};

const combinedOcrVariantScore = (text) => {
  const parsed = parseKLFromBillText(text);
  const p = scoreParsedBillQuality(parsed);
  if (p > 0) return p + 500;
  return scoreOcrTextRichness(text);
};

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });

// ─── HF OCR (server-side, fast when warm) ───────────────────────────────────

export const extractTextFromImageUsingHf = async (imageFile) => {
  try {
    // Resize for server OCR. Use a much larger size so printed bills keep digits.
    // If the resized attempt returns sparse text, we'll retry with the original image.
    const resizedFile = await resizeImageForHf(imageFile, 1400);
    const dataUrl = await fileToBase64(resizedFile);
    const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '');

    const response = await apiFetch('/neeru/ocr/hf', {
      method: 'POST',
      body: JSON.stringify({ imageBase64: base64 }),
      requireAuth: false, // OCR doesn't require login — it's a utility feature
    });

    let text = response?.text;
    if (typeof text !== 'string' || !text.trim() || ocrTextLooksBillSparse(text)) {
      // try again with original (un-resized) image as a last resort
      try {
        const origData = await fileToBase64(imageFile);
        const origBase64 = origData.replace(/^data:[^;]+;base64,/, '');
        const r2 = await apiFetch('/neeru/ocr/hf', {
          method: 'POST',
          body: JSON.stringify({ imageBase64: origBase64 }),
          requireAuth: false,
        });
        text = r2?.text || text;
      } catch (_) {
        // ignore and fall through to error
      }
    }

    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('Invalid HF response');
    }
    return { text, confidence: 75 };
  } catch (err) {
    console.warn('HF OCR failed:', err.message || err);
    throw err;
  }
};

/** Resize for server OCR (OCR.space). Larger than before — tiny 400px bills lose digits. */
const resizeImageForHf = async (imageFile, maxPx = 1400) => {
  try {
    const bitmap = await createImageBitmap(imageFile);
    if (bitmap.width <= maxPx && bitmap.height <= maxPx) return imageFile;
    const ratio = Math.min(maxPx / bitmap.width, maxPx / bitmap.height);
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * ratio);
    canvas.height = Math.round(bitmap.height * ratio);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    return await new Promise((resolve) => canvas.toBlob((b) => resolve(b || imageFile), 'image/jpeg', 0.72));
  } catch (_) {
    return imageFile;
  }
};

// ─── Tesseract worker (lazy-init, but pre-warmable) ──────────────────────────

export const initOCRWorker = async () => {
  if (ocrWorker) return ocrWorker;
  try {
    ocrWorker = await Tesseract.createWorker('eng', OEM.LSTM_ONLY, {
      logger: () => {},
    });
    // Best page-segmentation mode for printed bills (uniform text block)
    try {
      await ocrWorker.setParameters({
        tessedit_pageseg_mode: '6',
        user_defined_dpi: '300',
      });
    } catch (_) { /* ignore */ }
    if (import.meta.env.DEV) {
      console.log('[OCR] Tesseract worker ready');
    }
    return ocrWorker;
  } catch (error) {
    console.error('Tesseract init failed:', error);
    ocrWorker = null;
    throw new Error('OCR engine unavailable. Please enter manually.');
  }
};

/**
 * Pre-warm the Tesseract worker in the background.
 * Call this as soon as the scan modal opens so the worker is ready
 * by the time the user actually captures a photo.
 */
export const prewarmOCRWorker = () => {
  initOCRWorker().catch(() => { /* silent — will try again on actual scan */ });
};

// ─── Image preprocessing ─────────────────────────────────────────────────────

/**
 * Greyscale + contrast enhance for Tesseract (local processing)
 * Also caps image size to prevent memory issues
 */
const preprocessImageForOCR = async (imageFile, contrast = 1.5) => {
  try {
    const bitmap = await createImageBitmap(imageFile);
    const SCALE = computeScaleForBillOcr(bitmap.width, bitmap.height);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * SCALE);
    canvas.height = Math.round(bitmap.height * SCALE);
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    let lumSum = 0;
    for (let i = 0; i < data.length; i += 4) {
      lumSum +=
        0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }
    const meanLum = lumSum / (data.length / 4);
    const invertDarkPage = meanLum < 88;

    const intercept = 128 * (1 - contrast);

    for (let i = 0; i < data.length; i += 4) {
      let gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (invertDarkPage) gray = 255 - gray;
      const adjusted = Math.max(0, Math.min(255, contrast * gray + intercept));
      data[i] = data[i + 1] = data[i + 2] = adjusted;
    }

    ctx.putImageData(imageData, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob || imageFile), 'image/jpeg', 0.92);
    });
  } catch (_) {
    return imageFile;
  }
};

/** Otsu threshold on grey levels (0–255). */
const computeOtsuThreshold = (gray, len) => {
  const hist = new Array(256).fill(0);
  for (let i = 0; i < len; i += 1) hist[gray[i]] += 1;
  let sum = 0;
  for (let t = 0; t < 256; t += 1) sum += t * hist[t];
  let sumB = 0;
  let wB = 0;
  let wF = 0;
  let maxVar = 0;
  let threshold = 127;
  const total = len;
  for (let t = 0; t < 256; t += 1) {
    wB += hist[t];
    if (wB === 0) continue;
    wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) * (mB - mF);
    if (between > maxVar) {
      maxVar = between;
      threshold = t;
    }
  }
  return threshold;
};

/** Binarize (foreground dark) — often improves printed digits vs glare. */
const preprocessImageForOCRBinary = async (imageFile) => {
  try {
    const bitmap = await createImageBitmap(imageFile);
    const SCALE = computeScaleForBillOcr(bitmap.width, bitmap.height);

    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * SCALE);
    canvas.height = Math.round(bitmap.height * SCALE);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;
    const total = width * height;
    const gray = new Uint8Array(total);
    let gsum = 0;
    for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
      const g = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
      gray[p] = g;
      gsum += g;
    }
    const meanG = gsum / total;
    if (meanG < 88) {
      for (let p = 0; p < total; p += 1) gray[p] = 255 - gray[p];
    }
    const T = computeOtsuThreshold(gray, total);
    for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
      const v = gray[p] < T ? 0 : 255;
      data[i] = v;
      data[i + 1] = v;
      data[i + 2] = v;
    }
    ctx.putImageData(imageData, 0, 0);
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob || imageFile), 'image/png');
    });
  } catch (_) {
    return imageFile;
  }
};

// ─── Tesseract extraction ────────────────────────────────────────────────────

const extractWithTesseract = async (imageFile) => {
  const worker = await initOCRWorker();

  const recognizeBlob = async (blob, psm) => {
    await worker.setParameters({
      tessedit_pageseg_mode: String(psm),
      user_defined_dpi: '300',
    });
    const r = await worker.recognize(blob);
    return {
      text: r.data.text || '',
      confidence: r.data.confidence ?? 0,
    };
  };

  const blobs = await Promise.all([
    preprocessImageForOCR(imageFile, 1.48),
    preprocessImageForOCR(imageFile, 1.22),
    preprocessImageForOCRBinary(imageFile),
    preprocessImageForOCR(imageFile, 1.82),
    preprocessImageForOCR(imageFile, 1.25),
  ]);

  const steps = [
    { blob: imageFile, psm: '3', tag: 'raw_psm3' },
    { blob: imageFile, psm: '6', tag: 'raw_psm6' },
    { blob: blobs[0], psm: '6', tag: 'c148' },
    { blob: blobs[1], psm: '6', tag: 'c122' },
    { blob: blobs[2], psm: '6', tag: 'otsu' },
    { blob: blobs[4], psm: '11', tag: 'c125_psm11' },
  ];

  let best = await recognizeBlob(steps[0].blob, steps[0].psm);
  let bestScore = combinedOcrVariantScore(best.text);

  for (let i = 1; i < steps.length; i += 1) {
    if (bestScore >= 600) break;
    const v = await recognizeBlob(steps[i].blob, steps[i].psm);
    const s = combinedOcrVariantScore(v.text);
    if (
      s > bestScore ||
      (s === bestScore && v.confidence > best.confidence) ||
      (s === bestScore && v.confidence === best.confidence && v.text.length > best.text.length)
    ) {
      best = v;
      bestScore = s;
    }
  }

  await worker.setParameters({ tessedit_pageseg_mode: '6' });

  return { text: best.text, confidence: best.confidence };
};

// ─── Main: race HF vs Tesseract ──────────────────────────────────────────────

/** Reject header-only / year-only snippets that are not enough to read a bill. */
const ocrTextLooksBillSparse = (text) => {
  const t = String(text || '').trim();
  if (!t) return true;
  const digits = (t.match(/\d/g) || []).length;
  if (digits < 4) return true;
  if (t.length < 72) return true;
  return false;
};

/**
 * Extract text from an image.
 * HF and Tesseract run IN PARALLEL. HF can return first, but if the text is
 * too sparse for bill parsing we still wait for Tesseract (already running).
 */
export const extractTextFromImage = async (imageFile) => {
  const withTimeout = (promise, ms) =>
    Promise.race([
      promise,
      new Promise((resolve) => setTimeout(() => resolve(null), ms)),
    ]);

  // Wrap each engine so it never rejects — returns null on failure
  const hfPromise = extractTextFromImageUsingHf(imageFile).catch(() => null);
  const tessPromise = extractWithTesseract(imageFile).catch(() => null);

  const hfResult = await withTimeout(hfPromise, OCR_TIMEOUTS.hfFastMs);
  const hfText = hfResult?.text?.trim() || '';

  if (hfText && !ocrTextLooksBillSparse(hfText)) {
    return hfResult;
  }

  // HF missing, timed out, or too thin — wait for Tesseract, then pick richest usable text.
  const tessResult = await withTimeout(tessPromise, OCR_TIMEOUTS.tesseractMaxMs);
  const tessText = tessResult?.text?.trim() || '';

  const variantRank = (r) => (r?.text ? combinedOcrVariantScore(r.text) : -1);
  const ranked = [tessResult, hfResult].filter((r) => r && String(r.text || '').trim());
  ranked.sort((a, b) => variantRank(b) - variantRank(a));
  const bestRanked = ranked[0];

  if (bestRanked && !ocrTextLooksBillSparse(String(bestRanked.text || '').trim())) {
    return bestRanked;
  }

  const finalHf = await withTimeout(hfPromise, OCR_TIMEOUTS.hfLateRetryMs);
  const withFinal = [...ranked];
  if (finalHf?.text?.trim()) withFinal.push(finalHf);
  withFinal.sort((a, b) => variantRank(b) - variantRank(a));
  const winner = withFinal[0];
  const winText = String(winner?.text || '').trim();

  if (winner && !ocrTextLooksBillSparse(winText)) {
    return winner;
  }

  if (winner?.text && ocrTextHasMinimumBillSignals(winText)) {
    return winner;
  }

  const digits = (winText.match(/\d/g) || []).length;
  if (winner?.text && winText.length >= 28 && digits >= 3) {
    return winner;
  }

  const bestWeak = [...withFinal]
    .filter((r) => r && String(r.text || '').trim())
    .sort((a, b) => String(b.text).length - String(a.text).length)[0];
  if (bestWeak) {
    const t = String(bestWeak.text || '').trim();
    const d = (t.match(/\d/g) || []).length;
    if (t.length >= 24 && d >= 3) {
      return bestWeak;
    }
  }

  throw new Error(
    'Could not read the bill image. Try again with the full page in frame, good light, or use PDF / manual entry.',
  );
};

export const parseKLFromText = (text) => parseKLFromBillText(text);

// ─── Full pipeline ────────────────────────────────────────────────────────────

export const scanBillImage = async (imageFile, onProgress) => {
  onProgress?.('Reading bill...');
  const { text, confidence: ocrConfidence } = await extractTextFromImage(imageFile);

  onProgress?.('Extracting usage data...');
  const {
    kl,
    confidence: parseConfidence,
    patterns,
    candidates,
    guessed,
    primaryPattern,
  } = parseKLFromText(text);
  const billInfo = extractBillFieldsFromText(text);

  let finalConfidence = parseConfidence;
  if (ocrConfidence < 50) finalConfidence = 'low';

  const isMeterInference =
    primaryPattern === 'meter_reading_diff' || primaryPattern === 'meter_pair_diff';
  if (
    isMeterInference &&
    typeof ocrConfidence === 'number' &&
    ocrConfidence < 72 &&
    finalConfidence === 'high'
  ) {
    finalConfidence = 'medium';
  }

  let insight = '';
  if (kl != null) {
    if (kl > 35) insight = 'High usage — consider reducing shower/bath time and checking for leaks.';
    else if (kl > 20) insight = 'Above average usage; small changes can still save a lot of water.';
    else if (kl > 10) insight = 'Moderate usage — good job!';
    else insight = 'Excellent — your usage is very low. Keep it up!';
    if (guessed) insight += ' (Best guess — please verify.)';
  } else if (candidates?.length > 0) {
    insight = 'Could not confidently determine usage. Select the correct value below.';
  } else {
    insight = 'Unable to extract usage automatically. Enter it manually to continue.';
    if (import.meta.env.DEV) {
      console.warn('[Neeru OCR] No KL candidates. Text length:', text?.length ?? 0, 'preview:', String(text || '').slice(0, 400));
    }
  }

  return {
    kl,
    confidence: finalConfidence,
    patterns,
    candidates,
    guessed,
    billInfo,
    insight,
    rawText: text,
    ocrConfidence,
    primaryPattern,
    isMeterInference,
  };
};

// ─── Cleanup ──────────────────────────────────────────────────────────────────

export const terminateOCRWorker = async () => {
  if (ocrWorker) {
    await ocrWorker.terminate();
    ocrWorker = null;
  }
};
