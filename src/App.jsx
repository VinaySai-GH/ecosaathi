import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import AppRouter from './router.jsx';
import Aurora from './components/animations/Aurora.jsx';

export default function App() {
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
