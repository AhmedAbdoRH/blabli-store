import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';
import {
  onPwaPromptVisibilityChange,
  getIsPwaPromptVisible,
} from '../lib/pwaInstall';

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);
  const [pwaOpen, setPwaOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    setPwaOpen(getIsPwaPromptVisible());

    const unsub = onPwaPromptVisibilityChange((isOpen) => {
      setPwaOpen(isOpen);
    });

    return () => {
      unsub();
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {!pwaOpen && (
        <motion.div
          key="floating-contact-buttons"
          className="fixed bottom-6 left-4 sm:left-6 z-40 flex flex-col gap-3"
          initial={{ opacity: 0, y: 25, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* زر واتساب */}
          <motion.button
            onClick={() => window.open('https://wa.me/201050827788', '_blank')}
            className="pl-4 pr-4 py-3 shadow-2xl transition-all text-white bg-green-600 hover:bg-green-700 border-l-4 border-green-400 flex items-center gap-2 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            title="تواصل عبر واتساب"
          >
            <MessageCircle className="h-5 w-5 text-white" />
            <span className="text-sm font-bold whitespace-nowrap">واتساب</span>
          </motion.button>

          {/* زر اتصال */}
          <motion.button
            onClick={() => window.open('tel:01050827788', '_self')}
            className="pl-4 pr-4 py-3 shadow-2xl transition-all text-white bg-blue-600 hover:bg-blue-700 border-l-4 border-blue-400 flex items-center gap-2 rounded-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            title="اتصل بنا"
          >
            <Phone className="h-5 w-5 text-white" />
            <span className="text-sm font-bold whitespace-nowrap">اتصال</span>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
