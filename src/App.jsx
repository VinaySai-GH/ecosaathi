import React, { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRouter from './router.jsx';
import Aurora from './components/animations/Aurora.jsx';
import { initOCRWorker } from './utils/ocr.js';

export default function App() {
  // Preload OCR worker on app startup (avoids 50s wait during first bill scan)
  useEffect(() => {
    initOCRWorker().catch((err) => {
      console.log('[OCR] Preload skipped (optional feature):', err.message);
    });
  }, []);

  return (
    <AuthProvider>
      <div style={{ position: 'relative', minHeight: '100vh', width: '100%', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 1 }}>
          <Aurora
            colorStops={["#00ff87", "#60efff", "#1DE9B6"]} // Hyper-vivid Neon Eco 
            blend={0.6}
            amplitude={1.2}
            speed={0.5}
          />
        </div>
        <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
          <AppRouter />
        </div>
      </div>
    </AuthProvider>
  );
}
