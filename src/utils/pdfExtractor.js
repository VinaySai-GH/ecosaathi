import * as pdfjsLib from 'pdfjs-dist';
import { extractBillFieldsFromText, parseKLFromBillText } from './waterBillParser.js';

// Use new URL() so Vite can resolve the worker asset without needing an
// exports map entry (pdfjs-dist v5 has no "exports" field in package.json).
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).href;


export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let extractedText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();

      // Preserve document structure better:
      // Check both Y-position (line breaks) and X-position (column structure)
      // This helps with table-based bills where values are in specific columns
      let lastY = null;
      let lastX = null;
      const lineChunks = [];
      
      for (const item of textContent.items) {
        if (!item.str) continue;
        
        const currentY = item.transform ? item.transform[5] : null;
        const currentX = item.transform ? item.transform[4] : null;
        
        // New line if Y-position changed significantly (>5 units)
        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 3) {
          lineChunks.push('\n');
          lastX = null;
        }
        // Add space if X position jumped (column gap) but same line
        else if (lastX !== null && currentX !== null && (currentX - lastX) > 10) {
          lineChunks.push('\t'); // Tab for column separation
        }
        
        lineChunks.push(item.str);
        lastY = currentY;
        lastX = currentX ? currentX + (item.width || 0) : currentX;
      }
      
      extractedText += lineChunks.join('') + '\n';
    }

    return extractedText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Make sure it is a text-based PDF, not a scanned image.');
  }
};

// Extract KL from bill text (works for both PDF and OCR text)
export const extractKLFromBillText = (text) => {
  const result = parseKLFromBillText(text);
  console.log('[PDF] Extraction candidates:', result.candidates);
  return result.kl;
};

// Extract meter reading and other bill details
export const extractBillDetails = (text) => {
  return extractBillFieldsFromText(text);
};

// Generate smart insights based on bill text and comparisons
export const generateBillInsight = (kl, text, cityBenchmark, previousKL = null) => {
  const billDetails = extractBillDetails(text);
  let insight = '';
  let emoji = '💧';

  const percentAboveBenchmark = (((kl - cityBenchmark) / cityBenchmark) * 100).toFixed(0);
  const percentChange = previousKL ? (((kl - previousKL) / previousKL) * 100).toFixed(0) : null;

  if (kl > cityBenchmark * 1.5) {
    emoji = '⚠️';
    insight = `⚠️ High usage detected! ${kl}KL is ${percentAboveBenchmark}% above ${cityBenchmark}KL benchmark. Common culprits: AC running 24/7, leaky taps, garden watering. Fix 1 leak = save ~${(kl * 0.1).toFixed(1)}KL/month.`;
  } else if (kl > cityBenchmark) {
    emoji = '📊';
    insight = `Usage is ${percentAboveBenchmark}% above city average. Likely reason: larger family or more AC usage. Try: shower timer (2 min), check toilet for silent leaks (dye test).`;
  } else if (percentChange && percentChange > 20) {
    emoji = '📈';
    insight = `Usage jumped ${percentChange}% from last month! Check if: AC running more, new appliances, or weather got hotter. Compare next month to confirm trend.`;
  } else {
    emoji = '✨';
    insight = `Great! You're ${Math.abs(percentAboveBenchmark)}% below city average. Keep using eco-friendly habits: rainwater harvesting, bucket bathing, plant-based cleaning.`;
  }

  return {
    insight,
    emoji,
    billDetails,
    comparison: {
      kl,
      benchmark: cityBenchmark,
      percentAboveBenchmark: parseInt(percentAboveBenchmark),
      percentChange: percentChange ? parseInt(percentChange) : null,
    },
  };
};
