import React, { useState } from 'react';
import { extractTextFromPDF, extractKLFromBillText } from '../../utils/pdfExtractor.js';

export default function PDFUploadModal({ onClose, onExtracted }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState('');

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      setError('Please select a PDF file');
      return;
    }

    setIsLoading(true);
    setProgress('Extracting PDF text...');
    setError('');

    try {
      const text = await extractTextFromPDF(file);
      setProgress('Scanning for water usage...');

      const kl = extractKLFromBillText(text);
      if (!kl) {
        throw new Error('Could not find water usage amount in PDF. Check that it\'s a water bill and contains usage in KL or kilolitres.');
      }

      setProgress('');
      onExtracted(kl, text);
    } catch (err) {
      setError(err.message || 'Failed to extract bill data');
      setProgress('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: 16
    }}>
      <div style={{
        background: 'var(--bg)',
        borderRadius: 20,
        padding: 32,
        maxWidth: 400,
        width: '100%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        border: `1px solid rgba(110,224,127,0.2)`
      }}>
        <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>📄</div>

        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: 'var(--text)', textAlign: 'center' }}>
          Upload Water Bill PDF
        </h2>

        <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20, textAlign: 'center', lineHeight: 1.5 }}>
          Select your water bill PDF. We'll extract the usage amount and generate smart insights.
        </p>

        <label style={{
          display: 'block',
          padding: 24,
          border: `2px dashed var(--accent)`,
          borderRadius: 12,
          textAlign: 'center',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          background: 'rgba(110,224,127,0.05)',
          transition: 'all 0.2s ease',
          opacity: isLoading ? 0.5 : 1
        }}>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            disabled={isLoading}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: 24, marginBottom: 8 }}>📤</div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>
            Click to select PDF
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
            or drag & drop
          </div>
        </label>

        {progress && (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: 'rgba(110,224,127,0.1)',
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 13,
            color: 'var(--accent)',
            fontWeight: 600
          }}>
            {progress}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: 16,
            padding: 12,
            background: 'rgba(244,67,54,0.1)',
            borderRadius: 8,
            textAlign: 'center',
            fontSize: 13,
            color: '#f44336',
            fontWeight: 600
          }}>
            {error}
          </div>
        )}

        <button
          onClick={onClose}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: 12,
            marginTop: 20,
            border: 'none',
            borderRadius: 8,
            background: 'rgba(255,255,255,0.1)',
            color: 'var(--text)',
            fontSize: 14,
            fontWeight: 600,
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
            transition: 'all 0.2s ease'
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
