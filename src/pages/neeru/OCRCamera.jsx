import React, { useState, useRef, useEffect } from 'react';
import { scanBillImage, prewarmOCRWorker } from '../../utils/ocr.js';
import { Colors } from '../../constants/theme.js';
import './ocr-modal.css';

export default function OCRCamera({ onExtractedKL, onCancel }) {
  const [step, setStep] = useState('camera'); // 'camera' | 'preview' | 'extracting' | 'result' | 'manual'
  const [capturedImage, setCapturedImage] = useState(null);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');
  const [progressMessage, setProgressMessage] = useState('');
  const [manualKL, setManualKL] = useState('');
  const [selectedKL, setSelectedKL] = useState(null);
  const [showRawText, setShowRawText] = useState(false);
  const cameraInputRef = useRef(null);
  const canvasRef = useRef(null);

  // Pre-warm Tesseract worker in the background as soon as the modal opens.
  // This way the worker is already initialized by the time the user captures a photo.
  useEffect(() => {
    prewarmOCRWorker();
  }, []);

  /**
   * Handle photo capture from input
   */
  const handlePhotoCapture = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is image
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Read and preview
    const reader = new FileReader();
    reader.onload = (evt) => {
      setCapturedImage({
        file,
        preview: evt.target.result,
      });
      setError('');
      setStep('preview');
    };
    reader.readAsDataURL(file);
  };

  /**
   * Start OCR extraction with timeout handling
   */
  const handleExtract = async () => {
    if (!capturedImage) return;

    setStep('extracting');
    setError('');
    setProgressMessage('Starting OCR engines...');

    // 45s timeout — parallel HF + Tesseract should finish well within this
    const timeoutId = setTimeout(() => {
      setError('OCR is taking too long. Please enter manually.');
      setStep('manual');
    }, 45000);

    try {
      const result = await scanBillImage(capturedImage.file, (msg) => setProgressMessage(msg));
      clearTimeout(timeoutId);

      // If we didn't get a KL but we do have some candidates to pick from, show those.
      const hasCandidates = result.candidates && result.candidates.length > 0;
      if (result.kl === null && !hasCandidates) {
        // Extraction failed - show manual entry instead
        setError('Couldn\'t read the number automatically. No problem — just enter it below!');
        setStep('manual');
      } else {
        setExtractedData(result);
        setStep('result');
      }
    } catch (err) {
      clearTimeout(timeoutId);
      setError(err.message || 'OCR processing failed. Please enter manually.');
      setStep('manual');
    }
    setProgressMessage('');
  };

  /**
   * User confirms extracted KL
   */
  const handleConfirmKL = () => {
    if (typeof selectedKL === 'number' && !Number.isNaN(selectedKL)) {
      onExtractedKL(selectedKL);
    }
  };

  /**
   * Manual entry fallback
   */
  const handleManualEntry = () => {
    onCancel(step === 'result' && extractedData?.kl ? 'try_manual_with_hint' : null);
  };

  /**
   * Retake photo
   */
  const handleRetake = () => {
    setCapturedImage(null);
    setExtractedData(null);
    setError('');
    setStep('camera');
    setSelectedKL(null);
    setShowRawText(false);
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
    }
  };

  // When we have extracted data, preselect the value only if we're confident.
  useEffect(() => {
    if (!extractedData) return;
    if (extractedData.confidence === 'high' && typeof extractedData.kl === 'number') {
      setSelectedKL(extractedData.kl);
    } else {
      setSelectedKL(null);
    }
    setShowRawText(false);
  }, [extractedData]);

  /**
   * Keyboard navigation: Escape to close
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <div className="ocr-modal-overlay" onClick={(e) => e.target === e.currentTarget && onCancel()} onKeyDown={handleKeyDown} role="dialog" aria-modal="true" aria-label="Scan water bill">
      <div className="ocr-modal">
        {/* HEADER */}
        <div className="ocr-header">
          <button className="ocr-close-btn" onClick={onCancel} aria-label="Close bill scanner dialog" title="Press Escape to close">
            ✕
          </button>
          <h2 className="ocr-title">Scan Your Water Bill</h2>
          <p className="ocr-subtitle">Take a photo or upload an image</p>
        </div>

        {/* CAMERA STEP */}
        {step === 'camera' && (
          <div className="ocr-content">
            <div className="camera-guide">
              <div className="guide-icon">📷</div>
              <p className="guide-text">Position your bill clearly in the frame</p>
              <ul className="guide-tips">
                <li>✓ Flat surface, good lighting</li>
                <li>✓ Make sure "KL" or "units" text is visible</li>
                <li>✓ Avoid glare and shadows</li>
              </ul>
            </div>

            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoCapture}
              className="camera-input"
              aria-label="Capture bill photo"
            />
            <label htmlFor="camera-input" className="camera-button btn-primary">
              <span className="camera-icon">📷</span>
              <span>Take Photo</span>
            </label>

            {/* Hidden input for file dialog */}
            <input
              id="camera-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoCapture}
              style={{ display: 'none' }}
              aria-label="Upload bill image"
            />

            <button className="btn-secondary" onClick={onCancel}>
              Enter Manually Instead
            </button>
          </div>
        )}

        {/* PREVIEW STEP */}
        {step === 'preview' && capturedImage && (
          <div className="ocr-content">
            <div className="preview-container">
              <img src={capturedImage.preview} alt="Bill preview" className="bill-preview" />
            </div>

            {error && <div className="ocr-error-banner">{error}</div>}

            <div className="preview-actions">
              <button className="btn-secondary" onClick={handleRetake}>
                ← Retake Photo
              </button>
              <button
                className="btn-primary"
                onClick={handleExtract}
                disabled={!capturedImage}
                style={{ flex: 1 }}
              >
                Extract Number →
              </button>
            </div>

            <button className="btn-text" onClick={handleManualEntry}>
              Enter manually instead
            </button>
          </div>
        )}

        {/* EXTRACTING STEP */}
        {step === 'extracting' && (
          <div className="ocr-content" style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div className="spinner"></div>
            <p className="extracting-text">{progressMessage || 'Reading your bill...'}</p>
            <p className="extracting-subtext">First time may take up to 60 seconds</p>
            <button
              className="btn-text"
              onClick={() => { setStep('manual'); setProgressMessage(''); }}
              style={{ marginTop: '16px' }}
            >
              Taking too long? Enter manually →
            </button>
          </div>
        )}

        {/* RESULT STEP */}
        {step === 'result' && extractedData && (
          <div className="ocr-content">
            {/* If OCR is uncertain, let the user pick from candidate values (but don't auto-guess) */}
            {extractedData.candidates?.length > 0 && extractedData.confidence !== 'high' && (
              <div className="candidate-list">
                <p className="candidate-label">
                  We could not confidently read the usage from the scan. Please pick the correct value below:
                </p>
                <div className="candidate-buttons">
                  {extractedData.candidates.slice(0, 5).map((candidate, idx) => (
                    <button
                      key={idx}
                      className={
                        'btn-secondary' +
                        (selectedKL === candidate.value ? ' selected' : '')
                      }
                      style={{ margin: 4 }}
                      onClick={() => {
                        setSelectedKL(candidate.value);
                      }}
                    >
                      Use {candidate.value} KL
                    </button>
                  ))}
                  <button
                    className="btn-text"
                    onClick={() => setStep('manual')}
                    style={{ margin: 4 }}
                  >
                    None of these — enter manually
                  </button>
                </div>
              </div>
            )}

            <div
              className={`result-card result-${extractedData.confidence}`}
              style={{
                borderColor:
                  extractedData.confidence === 'high'
                    ? Colors.accent
                    : extractedData.confidence === 'medium'
                      ? Colors.warning
                      : Colors.danger,
              }}
            >
              <div className="result-confidence-badge">
                {extractedData.confidence === 'high'
                  ? '✅ High confidence'
                  : extractedData.confidence === 'medium'
                    ? '⚠️ Medium confidence'
                    : '❓ Low confidence'}
              </div>

              <div className="result-display">
                <span className="result-value" style={{ color: Colors.accent }}>
                  {typeof selectedKL === 'number' ? selectedKL.toFixed(2) : '—'}
                </span>
                <span className="result-unit">KL</span>
              </div>

              <p className="result-subtitle">
                {selectedKL == null
                  ? 'Select the correct value from the options below or enter manually.'
                  : 'Looks correct?'}
              </p>
            </div>

            {/* Detection details */}
            {extractedData?.patterns?.length > 0 && (
              <div className="detection-details">
                <p className="detection-label">Detected from:</p>
                {extractedData.patterns.map((pattern, i) => (
                  <div key={i} className="detection-item">
                    {pattern}
                  </div>
                ))}
              </div>
            )}

            {(typeof extractedData.ocrConfidence === 'number' || extractedData.rawText) && (
              <div className="detection-details" style={{ marginTop: 12 }}>
                {typeof extractedData.ocrConfidence === 'number' && (
                  <div className="detection-item">
                    OCR confidence (approx): {Math.round(extractedData.ocrConfidence)}%
                  </div>
                )}
                <button
                  className="btn-text"
                  style={{ marginTop: 8 }}
                  onClick={() => setShowRawText((prev) => !prev)}
                >
                  {showRawText ? 'Hide scanned text' : 'Show scanned text'}
                </button>
                {showRawText && (
                  <pre className="ocr-raw-text">
                    {extractedData.rawText || 'No text extracted.'}
                  </pre>
                )}
              </div>
            )}

            <div className="result-actions">
              <button className="btn-secondary" onClick={handleRetake}>
                ← Try again
              </button>
              <button
                className="btn-primary"
                onClick={handleConfirmKL}
                style={{ flex: 1 }}
                disabled={typeof selectedKL !== 'number'}
              >
                {typeof selectedKL === 'number' ? 'Yes, use this →' : 'Select a value above'}
              </button>
            </div>

            <button className="btn-text" onClick={handleManualEntry}>
              No, I'll enter manually
            </button>

            {/* Insights & extracted bill info */}
            {extractedData.insight && (
              <div className="ocr-insight">
                <strong>Insight:</strong> {extractedData.insight}
              </div>
            )}

            {extractedData.billInfo && (
              <div className="ocr-bill-info">
                <div className="ocr-bill-info-row">
                  <span className="ocr-bill-info-label">Account:</span>
                  <span className="ocr-bill-info-value">{extractedData.billInfo.accountNumber || '—'}</span>
                </div>
                <div className="ocr-bill-info-row">
                  <span className="ocr-bill-info-label">Name:</span>
                  <span className="ocr-bill-info-value">{extractedData.billInfo.accountName || '—'}</span>
                </div>
                <div className="ocr-bill-info-row">
                  <span className="ocr-bill-info-label">Bill date:</span>
                  <span className="ocr-bill-info-value">{extractedData.billInfo.billDate || '—'}</span>
                </div>
                <div className="ocr-bill-info-row">
                  <span className="ocr-bill-info-label">Total due:</span>
                  <span className="ocr-bill-info-value">{extractedData.billInfo.totalDue || '—'}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MANUAL ENTRY STEP */}
        {step === 'manual' && (
          <div className="ocr-content">
            {capturedImage && (
              <div style={{ marginBottom: 20 }}>
                <div className="preview-container" style={{ maxHeight: 200 }}>
                  <img src={capturedImage.preview} alt="Bill preview" className="bill-preview" />
                </div>
              </div>
            )}

            {error && <div className="ocr-error-banner">{error}</div>}

            <div style={{ marginTop: 20 }}>
              <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                Water used (KL)
              </label>
              <input
                type="number"
                placeholder="e.g. 45.5"
                value={manualKL}
                onChange={(e) => setManualKL(e.target.value)}
                min="0"
                step="0.1"
                max="500"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: 16,
                  border: `1px solid rgba(110,224,127,0.3)`,
                  borderRadius: 8,
                  background: 'rgba(255,255,255,0.05)',
                  color: 'var(--text)',
                  marginBottom: 16,
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
              <p style={{ fontSize: 12, color: 'var(--text-dim)', marginBottom: 16 }}>
                ✓ Check your bill for "units consumed", "total usage", or "KL used"
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              {capturedImage && (
                <button
                  className="btn-secondary"
                  onClick={handleRetake}
                  style={{ flex: 1 }}
                >
                  ← Try new photo
                </button>
              )}
              <button
                className="btn-primary"
                onClick={() => {
                  const parsed = parseFloat(manualKL);
                  if (!isNaN(parsed) && parsed > 0 && parsed < 500) {
                    onExtractedKL(parsed);
                  } else {
                    setError('Please enter a valid number between 0 and 500');
                  }
                }}
                disabled={!manualKL}
                style={{ flex: 1 }}
              >
                Use {manualKL ? manualKL : '—'} KL →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
