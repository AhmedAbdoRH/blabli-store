import { useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

const STORAGE_KEY = 'blabli-pwa-install-dismissed';
const SHOW_DELAY_MS = 2500;

function isIos(): boolean {
  if (typeof window === 'undefined') return false;
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const nav = window.navigator as Navigator & { standalone?: boolean };
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [isIosDevice, setIsIosDevice] = useState(false);
  const [installing, setInstalling] = useState(false);

  useEffect(() => {
    if (isStandalone()) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      // ignore storage errors
    }

    const ios = isIos();
    setIsIosDevice(ios);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show as soon as the browser is ready to install
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstall);

    // First visit: show our invite after a short delay
    // (iOS never fires beforeinstallprompt, so this is required)
    const timer = window.setTimeout(() => {
      setVisible(true);
    }, SHOW_DELAY_MS);

    const onInstalled = () => {
      setVisible(false);
      setDeferredPrompt(null);
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // ignore
      }
    };

    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', onBeforeInstall);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      setInstalling(true);
      await deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      dismiss();
    } catch (err) {
      console.error('PWA install failed:', err);
    } finally {
      setInstalling(false);
      setDeferredPrompt(null);
    }
  };

  if (isStandalone()) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-4 left-4 right-4 z-[100] mx-auto max-w-md"
          dir="rtl"
          role="dialog"
          aria-labelledby="pwa-install-title"
          aria-describedby="pwa-install-desc"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-xl">
            <button
              type="button"
              onClick={dismiss}
              className="absolute left-3 top-3 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink"
              aria-label="إغلاق"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-start gap-3 pe-6">
              <img
                src="/logo.jpeg"
                alt="blabli"
                className="h-14 w-14 shrink-0 rounded-xl object-cover shadow-md"
              />
              <div className="min-w-0 flex-1">
                <h3 id="pwa-install-title" className="text-base font-black text-ink">
                  ثبّت تطبيق blabli
                </h3>
                <p id="pwa-install-desc" className="mt-1 text-sm leading-relaxed text-gray-600">
                  أضف الموقع لشاشة هاتفك وافتحه كتطبيق بسرعة وسهولة.
                </p>
              </div>
            </div>

            {isIosDevice ? (
              <div className="mt-4 rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-700">
                <p className="mb-2 font-semibold text-ink">على آيفون / آيباد:</p>
                <ol className="list-decimal space-y-1.5 pe-5 text-gray-600">
                  <li className="flex flex-wrap items-center gap-1.5">
                    اضغط زر المشاركة
                    <Share className="inline h-4 w-4 shrink-0 text-brand" />
                    في Safari
                  </li>
                  <li>
                    اختر <span className="font-bold text-ink">Add to Home Screen</span>
                  </li>
                  <li>
                    ثم اضغط <span className="font-bold text-ink">Add</span>
                  </li>
                </ol>
                <button
                  type="button"
                  onClick={dismiss}
                  className="mt-3 w-full rounded-xl bg-ink py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand"
                >
                  حسناً، فهمت
                </button>
              </div>
            ) : (
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={dismiss}
                  className="flex-1 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50"
                >
                  لاحقاً
                </button>
                {deferredPrompt ? (
                  <button
                    type="button"
                    onClick={handleInstall}
                    disabled={installing}
                    className="btn-shine flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-bold text-white shadow-brand transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {installing ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>تثبيت التطبيق</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={dismiss}
                    className="btn-shine flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-bold text-white shadow-brand transition-colors hover:bg-brand-deep"
                  >
                    <Download className="h-4 w-4" />
                    <span>حسناً</span>
                  </button>
                )}
              </div>
            )}

            {!isIosDevice && !deferredPrompt && (
              <p className="mt-3 text-center text-xs text-gray-500">
                من متصفح Chrome: القائمة ⋮ ← تثبيت التطبيق / Install app
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
