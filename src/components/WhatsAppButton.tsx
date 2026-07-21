import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

export default function WhatsAppButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3">
      <motion.button
        onClick={() => window.open('https://wa.me/201050827788', '_blank')}
        className="pl-4 pr-4 py-3 shadow-2xl transition-all text-white bg-green-600 hover:bg-green-700 border-l-4 border-green-400 flex items-center gap-2 rounded-xl"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        title="تواصل عبر واتساب"
      >
        <MessageCircle className="h-5 w-5 text-white" />
        <span className="text-sm font-bold whitespace-nowrap">واتساب</span>
      </motion.button>

      <motion.button
        onClick={() => window.open('tel:01050827788', '_self')}
        className="pl-4 pr-4 py-3 shadow-2xl transition-all text-white bg-blue-600 hover:bg-blue-700 border-l-4 border-blue-400 flex items-center gap-2 rounded-xl"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        title="اتصل بنا"
      >
        <Phone className="h-5 w-5 text-white" />
        <span className="text-sm font-bold whitespace-nowrap">اتصال</span>
      </motion.button>
    </div>,
    document.body
  );
}
