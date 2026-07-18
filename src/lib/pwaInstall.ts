/**
 * Capture the browser install prompt as early as possible.
 * React remounts (Strict Mode) can miss `beforeinstallprompt` if we only listen inside a component.
 */

export interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const READY_EVENT = 'blabli-pwa-prompt-ready';

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let listenersAttached = false;

export function initPwaInstallCapture(): void {
  if (typeof window === 'undefined' || listenersAttached) return;
  listenersAttached = true;

  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
    window.dispatchEvent(new CustomEvent(READY_EVENT));
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
  });
}

export function getDeferredInstallPrompt(): BeforeInstallPromptEvent | null {
  return deferredPrompt;
}

export function clearDeferredInstallPrompt(): void {
  deferredPrompt = null;
}

export function onInstallPromptReady(callback: () => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener(READY_EVENT, handler);
  return () => window.removeEventListener(READY_EVENT, handler);
}

export function isIosDevice(): boolean {
  if (typeof window === 'undefined') return false;
  const ua = window.navigator.userAgent.toLowerCase();
  const iOS = /iphone|ipad|ipod/.test(ua);
  // iPadOS 13+ may report as Mac with touch
  const iPadOs =
    ua.includes('mac') && typeof document !== 'undefined' && 'ontouchend' in document;
  return iOS || iPadOs;
}

export function isStandaloneMode(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    nav.standalone === true
  );
}

export async function triggerPwaInstall(): Promise<'accepted' | 'dismissed' | 'unavailable'> {
  const promptEvent = deferredPrompt;
  if (!promptEvent) return 'unavailable';

  try {
    await promptEvent.prompt();
    const { outcome } = await promptEvent.userChoice;
    deferredPrompt = null;
    return outcome;
  } catch (err) {
    console.error('PWA install prompt failed:', err);
    deferredPrompt = null;
    return 'unavailable';
  }
}
