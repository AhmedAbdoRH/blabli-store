import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { registerSW } from 'virtual:pwa-register';
import { initPwaInstallCapture } from './lib/pwaInstall';
import App from './App.tsx';
import './index.css';

// Capture install prompt before React mounts (event fires only once)
initPwaInstallCapture();

// Register service worker for PWA (auto-updates when a new build is deployed)
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
