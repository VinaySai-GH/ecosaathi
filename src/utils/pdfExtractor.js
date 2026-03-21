import * as pdfjsLib from 'pdfjs-dist';

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

      // Preserve line structure by checking vertical position of each item.
      // Joining with a plain space loses newlines, causing regex patterns to miss
      // multi-word labels like "Consumption:" that span label-value pairs.
      let lastY = null;
      const lineChunks = [];
      for (const item of textContent.items) {
        if (!item.str) continue;
        const currentY = item.transform ? item.transform[5] : null;
        if (lastY !== null && currentY !== null && Math.abs(currentY - lastY) > 5) {
          lineChunks.push('\n');
        }
        lineChunks.push(item.str);
        lastY = currentY;
      }
      extractedText += lineChunks.join(' ') + '\n';
    }

    return extractedText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF. Make sure it is a text-based PDF, not a scanned image.');
  }
};

// Extract KL from bill text (works for both PDF and OCR text)
export const extractKLFromBillText = (text) => {
  // Normalise: collapse extra spaces, uppercase
  const cleanText = text.replace(/\s+/g, ' ').toUpperCase();

  // Indian water bill patterns (various formats)
  const patterns = [
    // Pattern 1: "Consumption: 45 KL" / "CONSUMPTION 45 KL"
    /CONSUMPTION\s*[:\s]*(\d+(?:\.\d+)?)\s*(?:KL|KILOLITR|UNITS)/gi,

    // Pattern 2: "Units Consumed: 45" / "Total Consumption 45 KL"
    /TOTAL\s+(?:UNITS|CONSUMPTION|USED)\s*[:\s]*(\d+(?:\.\d+)?)\s*(?:KL|KILOLITR|UNITS)?/gi,

    // Pattern 3: "Current Reading" / "This Period Usage"
    /(?:CURRENT|THIS MONTH|THIS PERIOD)\s+(?:READING|USAGE)\s*[:\s]*(\d+(?:\.\d+)?)\s*(?:KL|KILOLITR|UNITS)?/gi,

    // Pattern 4: "Units: 45" (standalone) or "Units Consumed: 45"
    /UNITS\s*(?:CONSUMED)?\s*[:\s]*(\d+(?:\.\d+)?)/gi,

    // Pattern 5: Any number directly before KL/kilolitres
    /(\d+(?:\.\d+)?)\s*(?:KL|KILOLITR)/gi,

    // Pattern 6: Cubic metres — "45 cu.m" / "45 m3"
    /(\d+(?:\.\d+)?)\s*(?:CU\.?M|M3|CUBIC\s*METER)/gi,

    // Pattern 7: "Water Usage 45" or "Water Used 45"
    /WATER\s+(?:USAGE|USED|SUPPLIED|SUPPLY)\s*[:\s]*(\d+(?:\.\d+)?)/gi,
  ];

  const candidates = [];

  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(cleanText)) !== null) {
      const value = parseFloat(match[1]);
      // Valid household water usage: 0.1 – 500 KL/month
      if (!isNaN(value) && value > 0.1 && value < 500) {
        candidates.push({
          value,
          patternSrc: pattern.source.substring(0, 40),
          matchText: match[0],
        });
      }
    }
  }

  if (candidates.length === 0) return null;

  // Sort by proximity to typical household usage (20–50 KL)
  candidates.sort((a, b) => Math.abs(a.value - 35) - Math.abs(b.value - 35));

  console.log('[PDF] Extraction candidates:', candidates);
  return candidates[0].value;
};

// Extract meter reading and other bill details
export const extractBillDetails = (text) => {
  const details = {};
  const cleanText = text.toUpperCase();

  const consumerMatch = cleanText.match(/(?:CONSUMER|METER|REF)\s*(?:NO|#|ID)?[\s:]*([A-Z0-9-]+)/i);
  if (consumerMatch) details.consumerNumber = consumerMatch[1].trim();

  const accountMatch = cleanText.match(/(?:ACCOUNT|A\/C)\s*(?:NO)?[\s:]*([0-9]+)/i);
  if (accountMatch) details.accountNumber = accountMatch[1].trim();

  const dateMatch = cleanText.match(/(?:BILL\s*)?DATE[\s:]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
  if (dateMatch) details.billDate = dateMatch[1];

  const dueMatch = cleanText.match(/DUE\s*DATE[\s:]*(\d{1,2}[-\/]\d{1,2}[-\/]\d{2,4})/i);
  if (dueMatch) details.dueDate = dueMatch[1];

  const currentReadingMatch = cleanText.match(/CURRENT\s*(?:READING|RDNG)[\s:]*(\d+)/i);
  if (currentReadingMatch) details.currentReading = currentReadingMatch[1];

  const previousReadingMatch = cleanText.match(/PREVIOUS\s*(?:READING|RDNG)[\s:]*(\d+)/i);
  if (previousReadingMatch) details.previousReading = previousReadingMatch[1];

  const divisionMatch = cleanText.match(/(?:DIVISION|CIRCLE|ZONE)[\s:]*([A-Z0-9\s]+?)(?:\n|$|CONSUMER)/i);
  if (divisionMatch) details.division = divisionMatch[1].trim();

  return details;
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
