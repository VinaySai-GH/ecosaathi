// OCR Utility for Water Bill Extraction
// Uses Tesseract.js v5+ (local) + HF trocr (server-side) in parallel

import Tesseract from 'tesseract.js';
import { apiFetch } from '../api/client.js';

let ocrWorker = null;

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
    // Resize large images before sending to HF to avoid 413 Payload Too Large.
    // Max 1500px on the long side is plenty for OCR quality.
    const resizedFile = await resizeImageForHf(imageFile, 1500);
    const dataUrl = await fileToBase64(resizedFile);
    const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '');

    const response = await apiFetch('/neeru/ocr/hf', {
      method: 'POST',
      body: JSON.stringify({ imageBase64: base64 }),
      requireAuth: true,
    });

    const text = response?.text;
    if (typeof text !== 'string' || !text.trim()) {
      throw new Error('Invalid HF response');
    }
    return { text, confidence: 75 };
  } catch (err) {
    console.warn('HF OCR failed:', err.message || err);
    throw err;
  }
};

/** Resize a File/Blob so its longest side is at most maxPx. Returns the original if already small enough. */
const resizeImageForHf = async (imageFile, maxPx = 1500) => {
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
    return await new Promise((resolve) => canvas.toBlob((b) => resolve(b || imageFile), 'image/jpeg', 0.88));
  } catch (_) {
    return imageFile;
  }
};

// ─── Tesseract worker (lazy-init, but pre-warmable) ──────────────────────────

export const initOCRWorker = async () => {
  if (ocrWorker) return ocrWorker;
  try {
    ocrWorker = await Tesseract.createWorker('eng');
    // Best page-segmentation mode for printed bills (uniform text block)
    try {
      await ocrWorker.setParameters({ tessedit_pageseg_mode: '6' });
    } catch (_) { /* ignore */ }
    console.log('[OCR] Tesseract worker ready');
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
 * Greyscale + contrast enhance.
 * Only upscale if the image is small — large photos are already sharp enough
 * and upscaling wastes time + memory.
 */
const preprocessImageForOCR = async (imageFile, contrast = 1.5) => {
  try {
    const bitmap = await createImageBitmap(imageFile);

    // Only scale up small images (< 1200px wide). Large photos are fine as-is.
    const SCALE = bitmap.width < 1200 ? 2 : 1;
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width * SCALE;
    canvas.height = bitmap.height * SCALE;
    const ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const intercept = 128 * (1 - contrast);

    for (let i = 0; i < data.length; i += 4) {
      const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      const adjusted = Math.max(0, Math.min(255, contrast * gray + intercept));
      data[i] = data[i + 1] = data[i + 2] = adjusted;
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

  // First pass at contrast 1.5
  const pass1 = await preprocessImageForOCR(imageFile, 1.5);
  const result1 = await worker.recognize(pass1);
  const conf1 = result1.data.confidence ?? 0;

  // Only do a second pass if the first one was poor
  if (conf1 >= 55) {
    return { text: result1.data.text || '', confidence: conf1 };
  }

  const pass2 = await preprocessImageForOCR(imageFile, 2.0);
  const result2 = await worker.recognize(pass2);
  const conf2 = result2.data.confidence ?? 0;

  // Return whichever pass gave better confidence
  if (conf2 > conf1) {
    return { text: result2.data.text || '', confidence: conf2 };
  }
  return { text: result1.data.text || '', confidence: conf1 };
};

// ─── Main: race HF vs Tesseract ──────────────────────────────────────────────

/**
 * Extract text from an image.
 * HF and Tesseract run IN PARALLEL. The first one to return usable text
 * "wins". If both finish, we prefer whichever gave higher confidence.
 */
export const extractTextFromImage = async (imageFile) => {
  // Wrap each engine so it never rejects — returns null on failure
  const hfPromise = extractTextFromImageUsingHf(imageFile).catch(() => null);
  const tessPromise = extractWithTesseract(imageFile).catch(() => null);

  // Race: if HF responds quickly enough, use it; otherwise fall through to Tesseract
  const hfResult = await Promise.race([
    hfPromise,
    new Promise((resolve) => setTimeout(() => resolve(null), 15000)), // 15s HF deadline
  ]);

  if (hfResult?.text?.trim()) {
    // HF won the race — but still wait for Tesseract in background for confidence check
    const tessResult = await tessPromise;
    // If Tesseract is dramatically more confident, prefer it
    if (tessResult?.confidence > 80 && tessResult.confidence > (hfResult.confidence ?? 0) + 15) {
      return tessResult;
    }
    return hfResult;
  }

  // HF timed out or failed — use Tesseract (already running in parallel, may already be done)
  const tessResult = await tessPromise;
  if (tessResult?.text?.trim()) {
    return tessResult;
  }

  // Both failed — last attempt: wait for HF if it still hasn't finished
  const finalHf = await hfPromise;
  if (finalHf?.text?.trim()) return finalHf;

  throw new Error('Could not read bill image. Please try again or enter manually.');
};

// ─── KL parser ───────────────────────────────────────────────────────────────

/**
 * Extract KL value from OCR text.
 * Handles patterns like "12.5 KL", "45 units", "consumption: 15000 L" etc.
 */
export const parseKLFromText = (text) => {
  if (!text || typeof text !== 'string') {
    return { kl: null, confidence: 'low', patterns: [], candidates: [], guessed: false };
  }

  const patterns = [
    // HIGH CONFIDENCE — HMWSSB / Indian municipal column header patterns (most reliable)
    // These are checked FIRST and given highest priority in sorting
    { regex: /CONSUMED[\s_]+UNITS[\s_]*\(?KL\)?[\s:\-]*(\d+\.?\d*)/gi, name: 'consumed_units_kl', conf: 'high', priority: 20 },
    { regex: /CHARGED[\s_]+QUANTITY[\s_]*\(?KL\)?[\s:\-]*(\d+\.?\d*)/gi, name: 'charged_qty_kl', conf: 'high', priority: 20 },
    { regex: /UNITS[\s_]+CONSUMED[\s_]*\(?KL\)?[\s:\-]*(\d+\.?\d*)/gi, name: 'units_consumed_kl', conf: 'high', priority: 20 },
    { regex: /WATER[\s_]+CONSUMPTION[\s_]*\(?KL\)?[\s:\-]*(\d+\.?\d*)/gi, name: 'water_consumption', conf: 'high', priority: 20 },

    // HIGH CONFIDENCE — number directly adjacent to KL label
    // Exclude range-context like "11-25 KL" using a negative lookbehind for hyphens/digits
    { regex: /(?<![-\d])(\d+\.?\d*)\s*KL\b/gi, name: 'kl_direct', conf: 'high', priority: 10 },
    { regex: /\bKL\b[\s:]*(\d+\.?\d*)/gi, name: 'kl_after_label', conf: 'high', priority: 10 },

    // MEDIUM CONFIDENCE — labelled but no explicit KL unit
    { regex: /(?:consumption|consumed|usage)[\s:]*(\d+\.?\d*)/gi, name: 'consumption_label', conf: 'medium', priority: 5 },
    { regex: /(?:water\s+supplied|supply)[\s:]*(\d+\.?\d*)/gi, name: 'water_supplied', conf: 'medium', priority: 5 },
    { regex: /(?:units?)[\s:]*(\d+\.?\d*)/gi, name: 'units', conf: 'medium', priority: 5 },
    { regex: /(\d+\.?\d*)\s*(?:cu\.?m|m3|cubic\s*meter)/gi, name: 'cubic_m', conf: 'medium', priority: 5 },
    { regex: /(?:current|this\s+month)\s+(?:reading|usage)[\s:]*(\d+\.?\d*)/gi, name: 'reading', conf: 'medium', priority: 5 },
  ];

  let matches = [];

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.regex.source, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      let value = parseFloat(match[1]);
      if (pattern.name === 'litres' || pattern.name === 'water_supplied') value /= 1000;
      if (pattern.name === 'cubic_m') value = value; // 1 m³ = 1 KL
      matches.push({ value, pattern: pattern.name, confidence: pattern.conf || 'medium', priority: pattern.priority || 5 });
    }
  }

  // Filter unrealistic values
  matches = matches.filter((m) => m.value > 0.1 && m.value < 500);

  const candidates = matches.map((m) => ({
    value: Number(m.value.toFixed(2)),
    pattern: m.pattern,
    confidence: m.confidence,
    raw: `${m.pattern}: ${m.value.toFixed(2)} KL`,
  }));

  if (matches.length === 0) {
    // Fallback: collect all plausible raw numbers
    const numericRegex = /\b(\d{1,3}(?:\.\d+)?)\b/g;
    const seen = new Set();
    const rawCandidates = [];
    let nm;
    while ((nm = numericRegex.exec(text)) !== null) {
      const val = parseFloat(nm[1]);
      if (!Number.isNaN(val) && val > 0.1 && val < 200 && !seen.has(val)) {
        seen.add(val);
        rawCandidates.push({ value: Number(val.toFixed(2)), pattern: 'raw number', confidence: 'low', raw: `${val} (raw number)` });
      }
    }
    return { kl: null, confidence: 'low', patterns: [], candidates: rawCandidates, guessed: rawCandidates.length > 0 };
  }

  const sorted = matches.sort((a, b) => {
    // Priority: HMWSSB patterns (20) > kl_direct (10) > medium (5)
    // Within same priority, prefer values closer to typical household usage (15-50 KL)
    const aScore = (a.priority || 5) * 10 - Math.abs(a.value - 25);
    const bScore = (b.priority || 5) * 10 - Math.abs(b.value - 25);
    return bScore - aScore;
  });

  const best = sorted[0];
  const confidence = best.confidence === 'high' ? 'high' : matches.length > 1 ? 'medium' : 'low';
  const guessed = confidence !== 'high';

  return {
    kl: guessed ? null : best.value,
    confidence,
    patterns: candidates.map((c) => c.raw),
    candidates,
    guessed,
  };
};

// ─── Bill field extractor ────────────────────────────────────────────────────

const extractBillFields = (text) => {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  const findLine = (regex) => lines.find((l) => regex.test(l));
  const pickValue = (line, regex) => {
    if (!line) return null;
    const match = line.match(regex);
    return match ? match[1].trim() : null;
  };
  return {
    accountNumber: pickValue(findLine(/account\s*(?:no|number)[:\-]?/i), /account\s*(?:no|number)[:\-]?\s*(.+)/i),
    accountName: pickValue(findLine(/(?:name|consumer|customer)[:\-]?/i), /(?:name|consumer|customer)[:\-]?\s*(.+)/i),
    billDate: pickValue(findLine(/(?:bill\s*date|date\s*of\s*bill|date)[:\-]?/i), /(?:bill\s*date|date\s*of\s*bill|date)[:\-]?\s*(.+)/i),
    totalDue: pickValue(findLine(/(?:total\s*due|net\s*amount|amount\s*due|total)[:\-]?\s*₹?/i), /(?:total\s*due|net\s*amount|amount\s*due|total)[:\-]?\s*(.+)/i),
  };
};

// ─── Full pipeline ────────────────────────────────────────────────────────────

export const scanBillImage = async (imageFile, onProgress) => {
  onProgress?.('Reading bill...');
  const { text, confidence: ocrConfidence } = await extractTextFromImage(imageFile);

  onProgress?.('Extracting usage data...');
  const { kl, confidence: parseConfidence, patterns, candidates, guessed } = parseKLFromText(text);
  const billInfo = extractBillFields(text);

  let finalConfidence = parseConfidence;
  if (ocrConfidence < 50) finalConfidence = 'low';

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
  }

  return { kl, confidence: finalConfidence, patterns, candidates, guessed, billInfo, insight, rawText: text, ocrConfidence };
};

// ─── Cleanup ──────────────────────────────────────────────────────────────────

export const terminateOCRWorker = async () => {
  if (ocrWorker) {
    await ocrWorker.terminate();
    ocrWorker = null;
  }
};
