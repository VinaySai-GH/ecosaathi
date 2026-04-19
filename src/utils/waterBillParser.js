const COMMON_SLAB_VALUES = new Set([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 20, 25, 26, 30, 34,
  50, 51, 60, 100, 150, 200,
]);

const normalizeText = (text) => {
  if (!text || typeof text !== 'string') return '';

  return text
    .replace(/\r/g, '\n')
    .replace(/[–—]/g, '-')
    .replace(/[•]/g, ' ')
    .replace(/₹|Rs\./gi, 'RS ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[^\S\n]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const extractMatches = (text, patternConfigs) => {
  const matches = [];

  for (const config of patternConfigs) {
    const regex = new RegExp(config.regex.source, config.regex.flags.includes('g') ? config.regex.flags : `${config.regex.flags}g`);
    let match;

    while ((match = regex.exec(text)) !== null) {
      const value = parseFloat(String(match[1]).replace(/,/g, ''));
      if (Number.isNaN(value) || value <= 0.1 || value > 600) continue;

      matches.push({
        value,
        pattern: config.name,
        confidence: config.confidence,
        priority: config.priority,
        raw: match[0].trim(),
      });
    }
  }

  return matches;
};

const isLikelySlabValue = (value) => COMMON_SLAB_VALUES.has(Math.round(value));

const dedupeCandidates = (items) => {
  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.value}-${item.pattern}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const parseNumericCell = (value) => {
  if (!value) return null;
  const match = String(value).match(/\d[\d,]*(?:\.\d+)?/);
  if (!match) return null;
  const parsed = parseFloat(match[0].replace(/,/g, ''));
  return Number.isNaN(parsed) ? null : parsed;
};

/**
 * Municipal bills often show "previous (KL)  current (KL)  consumed (KL)" on one line.
 * OCR may misread the first two columns but still read the printed consumption — prefer
 * that third value over inferring current minus previous from the same noisy pair.
 */
const extractInlineConsumptionTriplet = (text) => {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const out = [];
  const sep = '(?:\\s*\\|\\s*|\\s+)+';
  const anchoredTriplet = new RegExp(
    `^(\\d{1,3}(?:,\\d{3})+|\\d{3,6})${sep}(\\d{1,3}(?:,\\d{3})+|\\d{3,6})${sep}(\\d{1,3}(?:,\\d{3})?)\\b`,
  );

  for (const line of lines) {
    if (line.length > 200) continue;
    for (let pos = 0; pos < line.length; pos += 1) {
      if (!/\d/.test(line[pos])) continue;
      if (pos > 0 && /[A-Za-z0-9_]/.test(line[pos - 1])) continue;
      const m = anchoredTriplet.exec(line.slice(pos));
      if (!m) continue;
      const raw1 = m[1].replace(/,/g, '');
      const raw2 = m[2].replace(/,/g, '');
      const raw3 = m[3].replace(/,/g, '');
      if (/^0\d{3,}$/.test(raw1)) continue;
      const v1 = parseFloat(raw1);
      const v2 = parseFloat(raw2);
      const v3 = parseFloat(raw3);
      if (Number.isNaN(v1) || Number.isNaN(v2) || Number.isNaN(v3)) continue;
      if (v1 < 200 || v2 < 200) continue;
      if (v2 <= v1) continue;
      if (v3 < 0.5 || v3 > 400) continue;
      if (v1 > 990000 || v2 > 990000) continue;
      const rowMin = Math.min(v1, v2, v3);
      if (Math.abs(v3 - rowMin) > 0.001) continue;
      out.push({
        value: v3,
        pattern: 'table_row_consumed_cell',
        confidence: 'high',
        priority: 55,
        raw: `${m[1]} ${m[2]} ${m[3]}`,
      });
    }
  }
  return dedupeCandidates(out);
};

/** Highest listed tier on many Indian bills (Slab IV) includes the current usage ceiling in parentheses. */
const extractSlabIvUpperFromCharges = (text) => {
  const re =
    /Water\s+Charges[^\n]{0,120}?(?:Slab|Sab)\s*I[Vv][^\n]{0,40}?\(\s*(\d{1,2})\s*[-–]\s*(\d{1,3})\s*KL/gi;
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) {
    const lo = parseFloat(m[1]);
    const hi = parseFloat(m[2]);
    if (Number.isNaN(hi) || Number.isNaN(lo) || hi <= lo || hi > 500) continue;
    out.push({
      value: hi,
      pattern: 'billing_slab_iv_span',
      confidence: 'medium',
      priority: 48,
      raw: `${m[1]}-${m[2]} KL (Slab IV line)`,
    });
  }
  return dedupeCandidates(out);
};

const extractTableCandidates = (text) => {
  const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const candidates = [];

  for (let index = 0; index < lines.length - 1; index += 1) {
    const header = lines[index];
    const nextLine = lines[index + 1];
    const headerUpper = header.toUpperCase();

    if (!/(CONSUMED|UNITS\s+CONSUMED|WATER\s*\(KL\)|CURRENT\s+READING)/i.test(headerUpper)) {
      continue;
    }

    if (header.includes('|') && nextLine.includes('|')) {
      const headerParts = header.split('|').map((part) => part.trim());
      const valueParts = nextLine.split('|').map((part) => part.trim());
      const consumedIndex = headerParts.findIndex((part) => /(CONSUMED|UNITS\s+CONSUMED|WATER\s*\(KL\))/i.test(part));

      if (consumedIndex >= 0 && valueParts[consumedIndex]) {
        const parsed = parseNumericCell(valueParts[consumedIndex]);
        if (parsed && parsed > 0.1 && parsed < 600) {
          candidates.push({
            value: parsed,
            pattern: 'table_consumed_column',
            confidence: 'high',
            priority: 50,
            raw: valueParts[consumedIndex],
          });
        }
      }
    }

    const nextNumbers = (nextLine.match(/\d[\d,]*(?:\.\d+)?/g) || [])
      .map((value) => parseFloat(value.replace(/,/g, '')))
      .filter((value) => !Number.isNaN(value));

    if (/(PREVIOUS\s+READING|CURRENT\s+READING|UNITS\s+CONSUMED)/i.test(headerUpper) && nextNumbers.length >= 3) {
      const parsed = nextNumbers[2];
      if (parsed > 0.1 && parsed < 600) {
        candidates.push({
          value: parsed,
          pattern: 'table_triplet_readings',
          confidence: 'high',
          priority: 45,
          raw: nextLine,
        });
      }
    }

    if (/CONSUMED/i.test(headerUpper) && nextLine && !nextLine.includes('|')) {
      const cleaned = nextLine.replace(/%/g, ' ').replace(/\s+/g, ' ');
      const nums = (cleaned.match(/\d{1,3}(?:,\d{3})+|\d{3,6}/g) || []).map((x) =>
        parseFloat(x.replace(/,/g, '')),
      );
      const readings = nums.filter((n) => n >= 180 && n < 100000).sort((a, b) => a - b);
      if (readings.length >= 2) {
        const prev = readings[readings.length - 2];
        const cur = readings[readings.length - 1];
        if (cur > prev) {
          const diff = cur - prev;
          if (diff > 0.1 && diff < 500) {
            candidates.push({
              value: diff,
              pattern: 'table_meter_sorted_pair',
              confidence: 'medium',
              priority: 43,
              raw: `${prev} → ${cur} (${diff})`,
            });
          }
        }
      }
    }

    const nearbyLines = lines.slice(index + 1, index + 7);
    const numericOnlyLines = nearbyLines.filter((line) => /^[\d,.\s]+$/.test(line));
    const standaloneNumbers = numericOnlyLines
      .map((line) => parseNumericCell(line))
      .filter((value) => value !== null);

    if (/(PREVIOUS\s+READING|CURRENT\s+READING|UNITS\s+CONSUMED|WATER\s*\(KL\))/i.test(headerUpper) && standaloneNumbers.length >= 3) {
      const parsed = standaloneNumbers[2];
      if (parsed > 0.1 && parsed < 600) {
        candidates.push({
          value: parsed,
          pattern: 'table_stacked_readings',
          confidence: 'high',
          priority: 48,
          raw: numericOnlyLines.slice(0, 3).join(' | '),
        });
      }
    }
  }

  return candidates;
};

export const parseKLFromBillText = (rawText) => {
  const text = normalizeText(rawText);
  if (!text) {
    return {
      kl: null,
      confidence: 'low',
      patterns: [],
      candidates: [],
      guessed: false,
      primaryPattern: null,
    };
  }

  const patterns = [
    {
      name: 'consumption_label',
      regex: /(?:TOTAL\s+)?(?:WATER\s+)?(?:UNITS\s+CONSUMED|CONSUMED|CONSUMPTION|USAGE)\s*[:\-]?\s*(\d{1,3}(?:\.\d+)?)/gi,
      confidence: 'high',
      priority: 35,
    },
    {
      name: 'value_before_kl',
      regex: /(?:^|[^\d-])(\d{1,3}(?:\.\d+)?)\s*(?:KL|KILOLIT(?:RE|ER)S?|UNITS)(?!\s*[-\d])/gim,
      confidence: 'medium',
      priority: 20,
    },
    {
      name: 'cubic_meter_value',
      regex: /(?:^|[^\d-])(\d{1,3}(?:\.\d+)?)\s*(?:CU\.?\s*M|M3|CUBIC\s*METER)/gim,
      confidence: 'medium',
      priority: 18,
    },
  ];

  const directMatches = [
    ...extractInlineConsumptionTriplet(text),
    ...extractSlabIvUpperFromCharges(text),
    ...extractTableCandidates(text),
    ...extractMatches(text, patterns),
  ];
  let filteredMatches = directMatches.filter((match) => !isLikelySlabValue(match.value) || match.priority >= 35);

  const hasHighSignal = filteredMatches.some((match) => match.priority >= 35);
  if (!hasHighSignal) {
    filteredMatches = directMatches.filter((match) => !isLikelySlabValue(match.value));
  }

  const sortedMatches = dedupeCandidates(filteredMatches).sort((a, b) => {
    if (a.priority !== b.priority) return b.priority - a.priority;
    return b.value - a.value;
  });

  if (sortedMatches.length > 0) {
    const best = sortedMatches[0];
    const candidates = sortedMatches.map((match) => ({
      value: Number(match.value.toFixed(2)),
      pattern: match.pattern,
      confidence: match.confidence,
      raw: `${match.pattern}: ${match.raw}`,
    }));

    return {
      kl: Number(best.value.toFixed(2)),
      confidence: best.confidence,
      patterns: candidates.map((candidate) => candidate.raw),
      candidates,
      guessed: best.confidence !== 'high',
      primaryPattern: best.pattern,
    };
  }

  const meterDiffCandidates = extractConsumptionFromMeterReadings(text);
  if (meterDiffCandidates.length > 0) {
    const sorted = meterDiffCandidates.sort((a, b) => {
      if (b.priority !== a.priority) return b.priority - a.priority;
      return b.value - a.value;
    });
    const best = sorted[0];
    const list = sorted.map((m) => ({
      value: Number(m.value.toFixed(2)),
      pattern: m.pattern,
      confidence: 'high',
      raw: `${m.pattern}: ${m.raw}`,
    }));
    return {
      kl: Number(best.value.toFixed(2)),
      confidence: 'high',
      patterns: list.map((c) => c.raw),
      candidates: list,
      guessed: false,
      primaryPattern: best.pattern,
    };
  }

  const fallbackCandidates = [];
  const numberRegex = /\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d{1,5}(?:\.\d+)?/g;
  let numberMatch;

  while ((numberMatch = numberRegex.exec(text)) !== null) {
    const raw = numberMatch[0];
    const value = parseFloat(raw.replace(/,/g, ''));
    if (Number.isNaN(value) || value <= 0.1) continue;
    if (value > 400 && value < 1000) continue;
    if (value >= 1000) continue;
    if (isLikelySlabValue(value) && value <= 100) continue;

    fallbackCandidates.push({
      value: Number(value.toFixed(2)),
      pattern: 'raw_number',
      confidence: 'low',
      raw: `raw number: ${raw}`,
    });
  }

  let uniqueFallbacks = dedupeCandidates(fallbackCandidates).sort((a, b) => b.value - a.value);

  if (uniqueFallbacks.length === 0) {
    uniqueFallbacks = extractDigitTokensAsFallback(text);
  }

  if (uniqueFallbacks.length === 0) {
    return {
      kl: null,
      confidence: 'low',
      patterns: [],
      candidates: [],
      guessed: false,
      primaryPattern: null,
    };
  }

  return {
    kl: uniqueFallbacks[0].value,
    confidence: 'low',
    patterns: uniqueFallbacks.map((candidate) => candidate.raw),
    candidates: uniqueFallbacks,
    guessed: true,
    primaryPattern: uniqueFallbacks[0].pattern,
  };
};

/** Last resort: split on non-digits so broken OCR still yields pickable KL-sized numbers. */
const extractDigitTokensAsFallback = (text) => {
  const seen = new Set();
  const out = [];

  for (const raw of text.split(/[^\d]+/)) {
    if (!raw || raw.length > 5) continue;
    const value = parseFloat(raw);
    if (Number.isNaN(value) || value <= 0.1 || value > 500) continue;
    if (seen.has(value)) continue;
    seen.add(value);
    if (isLikelySlabValue(value) && value <= 100) continue;

    out.push({
      value: Number(value.toFixed(2)),
      pattern: 'digit_token',
      confidence: 'low',
      raw: `digit token: ${raw}`,
    });
  }

  return dedupeCandidates(out).sort((a, b) => b.value - a.value).slice(0, 12);
};

/** Bill OCR often picks "2024" and "2026" (dates/years) as two numbers — not meter readings. */
const bothLookLikeCalendarYears = (a, b) => {
  const ai = Math.round(a);
  const bi = Math.round(b);
  if (Math.abs(ai - a) > 0.001 || Math.abs(bi - b) > 0.001) return false;
  const inYearBand = (n) => n >= 1995 && n <= 2038;
  return inYearBand(ai) && inYearBand(bi);
};

/** When OCR only returns meter rows (large comma numbers), infer KL = current - previous. */
const extractConsumptionFromMeterReadings = (text) => {
  const lines = text.split(/\n/).map((l) => l.trim()).filter(Boolean);
  const out = [];

  const pushDiff = (a, b, pattern, priority) => {
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    if (lo < 500) return;
    if (bothLookLikeCalendarYears(lo, hi)) return;
    const diff = hi - lo;
    if (diff > 0.1 && diff <= 500) {
      out.push({
        value: diff,
        pattern,
        priority,
        raw: `${lo} → ${hi} (${diff} KL)`,
      });
    }
  };

  for (const line of lines) {
    const nums = [];
    const re = /\d{1,3}(?:,\d{3})+|\d{4,6}/g;
    let m;
    while ((m = re.exec(line)) !== null) {
      const v = parseFloat(m[0].replace(/,/g, ''));
      if (!Number.isNaN(v) && v >= 100 && v <= 999999) nums.push(v);
    }
    if (nums.length >= 2) {
      for (let i = 0; i < nums.length - 1; i += 1) {
        pushDiff(nums[i], nums[i + 1], 'meter_reading_diff', 42);
      }
    }
  }

  const joined = text.replace(/\s+/g, ' ');
  const pairRe = /(\d{1,3}(?:,\d{3})+|\d{4,6})\s+(\d{1,3}(?:,\d{3})+|\d{4,6})/g;
  let pm;
  while ((pm = pairRe.exec(joined)) !== null) {
    const a = parseFloat(pm[1].replace(/,/g, ''));
    const b = parseFloat(pm[2].replace(/,/g, ''));
    if (Number.isNaN(a) || Number.isNaN(b)) continue;
    pushDiff(a, b, 'meter_pair_diff', 41);
  }

  return dedupeCandidates(out);
};

export const extractBillFieldsFromText = (rawText) => {
  const text = normalizeText(rawText);
  const lines = text.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const findLine = (regex) => lines.find((line) => regex.test(line));
  const pickValue = (line, regex) => {
    if (!line) return null;
    const match = line.match(regex);
    if (!match || !match[1]) return null;
    const val = match[1].trim();
    // avoid returning bare header tokens like "Name" or "Account" which appear as labels
    if (/^(name|account|consumer|consumer no|consumer number|account no|account number)$/i.test(val)) return null;
    // reject trivial punctuation-only captures like "." or "-"
    if (!/[A-Za-z0-9]/.test(val) || val.length <= 1) return null;
    return val;
  };

  return {
    accountNumber: pickValue(findLine(/(?:account|consumer)\s*(?:no|number|id)[:\-]?/i), /(?:account|consumer)\s*(?:no|number|id)[:\-]?\s*(.+)/i),
    accountName: pickValue(findLine(/(?:name|consumer name|customer)[:\-]?/i), /(?:name|consumer name|customer)[:\-]?\s*(.+)/i),
    billDate: pickValue(findLine(/bill\s*date[:\-]?/i), /bill\s*date[:\-]?\s*(.+)/i),
    totalDue: pickValue(findLine(/(?:total amount (?:due|payable)|total due)[:\-]?\s*/i), /(?:total amount (?:due|payable)|total due)[:\-]?\s*(.+)/i),
  };
};
