import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/201099490594', '_blank');
  };

  const handlePhoneClick = () => {
    window.open('tel:01222582955', '_self');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  const handleClickOutside = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Main Button */}
      <motion.button
        onClick={toggleMenu}
        className="btn-shine fixed bottom-6 left-6 pl-4 pr-5 py-3 shadow-brand-lg transition-all text-white bg-brand hover:bg-brand-deep z-50 group border-l-4 border-brand-300"
        whileHover={{ scale: 1.03, x: 2 }}
        whileTap={{ scale: 0.98 }}
        animate={{
          opacity: isOpen ? 0.7 : 1,
          scale: isOpen ? 0.95 : 1
        }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <MessageCircle className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-white animate-pulse rounded-full"></span>
          </div>
          <span className="text-sm font-bold tracking-wide">تواصل معنا</span>
        </div>
      </motion.button>

      {/* Overlay to close menu when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={handleClickOutside}
        />
      )}

      {/* Expanded Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-20 left-6 flex flex-col gap-4 z-50"
          >
            {/* WhatsApp Button */}
            <motion.button
              onClick={handleWhatsAppClick}
              className="pl-6 pr-6 py-4 shadow-2xl transition-all text-white bg-green-600 hover:bg-green-700 border-l-4 border-green-400 flex items-center gap-3"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MessageCircle className="h-6 w-6 text-white" />
              <span className="text-base font-bold">تواصل عبر واتساب</span>
            </motion.button>

            {/* Phone Button */}
            <motion.button
              onClick={handlePhoneClick}
              className="pl-6 pr-6 py-4 shadow-2xl transition-all text-white bg-blue-600 hover:bg-blue-700 border-l-4 border-blue-400 flex items-center gap-3"
              whileHover={{ scale: 1.05, x: 2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Phone className="h-6 w-6 text-white" />
              <span className="text-base font-bold">اتصل بنا</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}