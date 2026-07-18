import { useCallback, useEffect, useState } from 'react';
import { Download, Share, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  clearDeferredInstallPrompt,
  getDeferredInstallPrompt,
  isIosDevice,
  isStandaloneMode,
  onInstallPromptReady,
  triggerPwaInstall,
} from '../lib/pwaInstall';

const STORAGE_KEY = 'blabli-pwa-install-dismissed';
const SHOW_DELAY_MS = 2000;

export default function InstallPWA() {
  const [canInstall, setCanInstall] = useState(false);
  const [visible, setVisible] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const refreshCanInstall = useCallback(() => {
    setCanInstall(!!getDeferredInstallPrompt());
  }, []);

  useEffect(() => {
    if (isStandaloneMode()) return;

    try {
      if (localStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      // ignore
    }

    setIsIos(isIosDevice());
    refreshCanInstall();

    const unsub = onInstallPromptReady(() => {
      refreshCanInstall();
      setVisible(true);
      setStatusMessage(null);
    });

    // Show invite on first visit even before the browser is ready
    const timer = window.setTimeout(() => {
      setVisible(true);
      refreshCanInstall();
    }, SHOW_DELAY_MS);

    const onInstalled = () => {
      setVisible(false);
      clearDeferredInstallPrompt();
      setCanInstall(false);
      try {
        localStorage.setItem(STORAGE_KEY, '1');
      } catch {
        // ignore
      }
    };

    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.clearTimeout(timer);
      unsub();
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [refreshCanInstall]);

  const dismiss = () => {
    setVisible(false);
    setStatusMessage(null);
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // ignore
    }
  };

  const handleInstall = async () => {
    // Re-read from module store (more reliable than React state alone)
    if (!getDeferredInstallPrompt()) {
      setStatusMessage(
        'المتصفح غير جاهز للتثبيت الآن. من Chrome: القائمة ⋮ ثم «تثبيت التطبيق» أو Install app.'
      );
      refreshCanInstall();
      return;
    }

    try {
      setInstalling(true);
      setStatusMessage(null);
      const outcome = await triggerPwaInstall();

      if (outcome === 'accepted') {
        dismiss();
        return;
      }

      if (outcome === 'dismissed') {
        // User closed the native dialog — keep our banner closed too
        dismiss();
        return;
      }

      setStatusMessage(
        'تعذر فتح نافذة التثبيت. جرّب من قائمة المتصفح: ⋮ ← تثبيت التطبيق / Install app'
      );
      setCanInstall(false);
    } finally {
      setInstalling(false);
      refreshCanInstall();
    }
  };

  if (isStandaloneMode()) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-20 left-4 right-4 z-[110] mx-auto max-w-md sm:bottom-4"
          dir="rtl"
          role="dialog"
          aria-labelledby="pwa-install-title"
          aria-describedby="pwa-install-desc"
        >
          <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white p-4 shadow-2xl">
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
                src="/pwa-icon-192.png"
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

            {isIos ? (
              <div className="mt-4 rounded-xl bg-gray-50 px-3 py-3 text-sm text-gray-700">
                <p className="mb-2 font-semibold text-ink">على آيفون / آيباد (Safari فقط):</p>
                <ol className="list-decimal space-y-1.5 pe-5 text-gray-600">
                  <li className="flex flex-wrap items-center gap-1.5">
                    اضغط زر المشاركة
                    <Share className="inline h-4 w-4 shrink-0 text-brand" />
                    أسفل الشاشة
                  </li>
                  <li>
                    مرّر واختر <span className="font-bold text-ink">Add to Home Screen</span>
                    {' / '}
                    <span className="font-bold text-ink">إضافة إلى الشاشة الرئيسية</span>
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
                <button
                  type="button"
                  onClick={handleInstall}
                  disabled={installing}
                  className="btn-shine flex flex-[1.4] items-center justify-center gap-2 rounded-xl bg-brand py-2.5 text-sm font-bold text-white shadow-brand transition-colors hover:bg-brand-deep disabled:cursor-not-allowed disabled:opacity-70"
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
              </div>
            )}

            {statusMessage && (
              <p className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-center text-xs leading-relaxed text-amber-800">
                {statusMessage}
              </p>
            )}

            {!isIos && !canInstall && !statusMessage && (
              <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
                إذا لم تفتح نافذة التثبيت: من Chrome اضغط ⋮ ثم «تثبيت التطبيق» أو Install app.
                <br />
                يجب فتح الموقع عبر HTTPS (النسخة المنشورة).
              </p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
