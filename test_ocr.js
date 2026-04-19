// Quick Tesseract smoke test. For full pipeline + parser against the repo PNG, run: npm run verify:bill
import Tesseract from 'tesseract.js';
import fs from 'fs';
import path from 'path';

const imageFile = './tirupati_water_bill (1).png';

async function testOCR() {
  console.log('=== Testing OCR with Tirupati water bill ===\n');
  
  try {
    // Create worker
    const worker = await Tesseract.createWorker('eng');
    console.log('✅ Tesseract worker created\n');

    // Recognize the image
    console.log('📸 Processing image...\n');
    const result = await worker.recognize(imageFile);
    
    const text = result.data.text;
    const confidence = result.data.confidence;
    
    console.log('=== EXTRACTED TEXT ===');
    console.log(text);
    console.log('\n=== CONFIDENCE ===');
    console.log(`${confidence}%\n`);
    
    // Look for the consumed KL value
    console.log('=== SEARCHING FOR KL VALUES ===');
    const klMatches = text.matchAll(/(\d+\.?\d*)\s*KL/gi);
    const matches = [...klMatches];
    
    if (matches.length === 0) {
      console.log('❌ No KL values found!');
    } else {
      console.log(`Found ${matches.length} KL values:`);
      matches.forEach((m, i) => {
        console.log(`  ${i + 1}. ${m[1]} KL`);
      });
    }
    
    // Look for "Consumed" patterns
    console.log('\n=== SEARCHING FOR "CONSUMED" PATTERNS ===');
    const consumedMatches = text.matchAll(/consumed[\s\S]*?(\d+\.?\d*)/gi);
    const consumedList = [...consumedMatches];
    
    if (consumedList.length === 0) {
      console.log('❌ No consumed values found!');
    } else {
      console.log(`Found ${consumedList.length} consumed patterns:`);
      consumedList.forEach((m, i) => {
        console.log(`  ${i + 1}. ${m[1]}`);
      });
    }
    
    // Look for all 3-digit numbers
    console.log('\n=== ALL 2-3 DIGIT NUMBERS IN TEXT ===');
    const numberMatches = text.matchAll(/\b(\d{1,3})\b/g);
    const numberList = [...new Set([...numberMatches].map(m => m[1]))].sort((a, b) => parseInt(a) - parseInt(b));
    console.log(numberList.join(', '));
    
    await worker.terminate();
    console.log('\n✅ Worker terminated');
    
  } catch (error) {
    console.error('❌ OCR Error:', error);
  }
}

testOCR();
