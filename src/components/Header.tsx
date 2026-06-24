import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ShoppingCart, Trash2, Menu, X as Close } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category, Service } from '../types/database';
import { useCart } from '../contexts/CartContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Service[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isDesktopSearchOpen, setIsDesktopSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // شعار الموقع الجديد
  const LOGO_URL = '/logo.jpeg';

  const {
    toggleCart,
    itemCount,
    cartItems,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    cartTotal,
    sendOrderViaWhatsApp,
  } = useCart();

  // كشف التمرير لتغيير شكل الهيدر
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const { data: services, error } = await supabase
        .from('services')
        .select(`*, category:categories(*), product_images(image_url)`)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);
      if (error) throw error;
      if (!services) {
        setSearchResults([]);
        return;
      }
      const formattedServices = services.map((service: any) => ({
        ...service,
        displayImage: service.product_images?.[0]?.image_url || service.image_url || '/placeholder-product.jpg',
      }));
      setSearchResults(formattedServices);
    } catch (error) {
      console.error('Error searching products:', error);
      setSearchResults([]);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase.from('categories').select('*').order('name');
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
      } finally {
        setLoadingCategories(false);
      }
    };
    if (isMenuOpen) fetchCategories();
  }, [isMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
          !(event.target as HTMLElement).closest('.mobile-menu-button')) {
        setIsMenuOpen(false);
      }
      if ('touches' in event) {
        const target = event.target as HTMLElement;
        if (searchInputRef.current && searchInputRef.current.contains(target)) return;
      } else {
        const target = event.target as HTMLElement;
        if (searchRef.current && !searchRef.current.contains(target)) {
          setIsSearchFocused(false);
        }
        if (isMobileSearchOpen && !target.closest('.mobile-search-container')) {
          const isSearchIcon = target.closest('button[aria-label="بحث"]');
          const isSearchInput = target.closest('input[type="text"]');
          if (!isSearchIcon && !isSearchInput) {
            setIsMobileSearchOpen(false);
            setSearchQuery('');
            setSearchResults([]);
          }
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isMobileSearchOpen]);

  useEffect(() => {
    if (isMobileSearchOpen && searchInputRef.current) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isMobileSearchOpen]);

  const formatPrice = (value: string) => {
    try {
      const num = parseFloat(value);
      if (isNaN(num)) return '٠ ج';
      return new Intl.NumberFormat('ar-EG', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num) + ' ج';
    } catch {
      return value + ' ج';
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-white/85 backdrop-blur-xl shadow-[0_4px_30px_rgba(15,72,125,0.08)] border-b border-brand-100'
            : 'bg-white border-b border-gray-100'
        }`}
      >
        <div className="container mx-auto px-4 py-2.5 relative flex items-center justify-between gap-4">
          {/* الجانب الأيسر: أزرار الموبايل + شريط البحث للديسكتوب + الرئيسية */}
          <div className="flex items-center gap-3 flex-1">
            {/* كلمة الرئيسية على اليمين */}
            <Link to="/" className="hidden md:block text-ink hover:text-brand transition-colors duration-300 font-semibold relative group ml-auto">
              الرئيسية
              <span className="absolute -bottom-1 right-0 w-0 h-0.5 bg-brand transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* زر القائمة للموبايل */}
            <button
              className="md:hidden text-ink p-2 -ml-2 mobile-menu-button hover:text-brand transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="القائمة"
            >
              {isMenuOpen ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* زر البحث للموبايل */}
            <button
              onClick={() => {
                const wasOpen = isMobileSearchOpen;
                setIsMobileSearchOpen(!wasOpen);
                if (isCartOpen) toggleCart(false);
                if (wasOpen && document.activeElement) (document.activeElement as HTMLElement).blur();
              }}
              className="md:hidden p-2 text-ink hover:text-brand transition-colors"
              aria-label="بحث"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* شريط البحث للديسكتوب - يظهر عند الضغط على زر البحث */}
            <AnimatePresence>
              {isDesktopSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '100%', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="hidden md:block relative overflow-hidden"
                  ref={searchRef}
                >
                    <div className="relative min-w-[300px]">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => {
                        setIsSearchFocused(true);
                        if (isCartOpen) toggleCart(false);
                      }}
                      onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                      placeholder="ابحث عن منتج..."
                      autoFocus
                      className="w-full bg-gradient-to-b from-gray-50 to-gray-100 text-ink placeholder-gray-400 py-3 pr-5 pl-12 rounded-2xl border border-gray-200/60 focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/40 focus:bg-white focus:shadow-[0_8px_32px_rgba(15,72,125,0.12)] transition-all duration-300 text-sm"
                    />
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4.5 w-4.5 text-gray-400" />
                    {searchQuery && (
                      <button
                        onClick={(e) => { e.stopPropagation(); clearSearch(); }}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ink hover:bg-gray-200 rounded-lg p-0.5 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* نتائج البحث */}
                  {isSearchFocused && (searchResults.length > 0 || (searchQuery.length >= 2 && searchResults.length === 0)) && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="absolute mt-3 w-full bg-white border border-gray-100 rounded-2xl shadow-soft-lg overflow-hidden z-50"
                    >
                      {searchResults.map((product: any) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center p-3 hover:bg-brand-50 transition-colors duration-200 border-b border-gray-50 last:border-0"
                          onClick={clearSearch}
                        >
                          <div className="w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={product.displayImage}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                            />
                          </div>
                          <div className="flex-1 text-right pr-3">
                            <h4 className="text-ink font-semibold">{product.title}</h4>
                            <p className="text-xs text-gray-500">{product.category?.name || ''}</p>
                          </div>
                        </Link>
                      ))}
                      {searchResults.length === 0 && searchQuery.length >= 2 && (
                        <div className="p-6 text-center text-gray-500">لا توجد نتائج لـ "{searchQuery}"</div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* اللوجو دائماً في المنتصف */}
          <Link to="/" className="flex-shrink-0 group z-10" onClick={() => { if (isDesktopSearchOpen) { setIsDesktopSearchOpen(false); clearSearch(); } }}>
            <img
              src={LOGO_URL}
              alt="blabli"
              className="h-9 md:h-12 w-auto transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* الجانب الأيمن: زر البحث للديسكتوب + روابط التنقل + السلة */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 justify-end">
            {/* زر البحث للديسكتوب */}
            {!isDesktopSearchOpen && (
              <button
                onClick={() => {
                  setIsDesktopSearchOpen(true);
                  if (isCartOpen) toggleCart(false);
                }}
                className="hidden md:flex p-2 text-ink hover:text-brand hover:bg-gray-100 rounded-xl transition-colors"
                aria-label="بحث"
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            <nav>
              <ul className="flex gap-4 md:gap-6 items-center">
                <li className="relative">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleCart(!isCartOpen); }}
                    className="relative p-2 text-ink hover:text-brand transition-colors group"
                    aria-label="عرض السلة"
                    aria-expanded={isCartOpen}
                  >
                    <div className="relative">
                      <ShoppingCart className="h-6 w-6 transition-transform group-hover:scale-110" />
                      {itemCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 bg-brand text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1 border-2 border-white shadow-md"
                        >
                          {itemCount > 9 ? '9+' : itemCount}
                        </motion.span>
                      )}
                    </div>
                  </button>

                  {/* نافذة السلة المنسدلة */}
                  {isCartOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="fixed left-1/2 transform -translate-x-1/2 mt-2 w-[90vw] max-w-2xl max-h-[calc(100vh-8rem)] bg-white border border-gray-100 rounded-3xl shadow-soft-lg z-50 p-5 overflow-y-auto"
                      style={{ top: 'calc(var(--header-height, 5rem) + 1rem)' }}
                    >
                      <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                        <h3 className="text-ink font-bold text-lg flex items-center gap-2">
                          <ShoppingCart className="h-5 w-5 text-brand" />
                          سلة التسوق
                        </h3>
                        <span className="text-sm text-gray-500">{itemCount} عنصر</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto pr-1">
                        {cartItems.length === 0 ? (
                          <div className="py-10 text-center text-gray-400">
                            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-40" />
                            سلتك فارغة
                          </div>
                        ) : (
                          cartItems.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-0">
                              <div className="w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                <img
                                  src={item.imageUrl}
                                  alt={item.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                                />
                              </div>
                              <div className="flex-1 text-right">
                                <h4 className="text-ink text-sm font-semibold line-clamp-1">{item.title}</h4>
                                <div className="flex items-center justify-between mt-1.5">
                                  <span className="text-brand font-bold">{item.price} ج</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        if (item.quantity > 1) updateQuantity(item.id, item.quantity - 1);
                                        else { removeFromCart(item.id); toast.success('تمت إزالة المنتج من السلة'); }
                                      }}
                                      className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md hover:bg-brand hover:text-white transition-colors text-ink"
                                    >-</button>
                                    <span className="text-ink w-6 text-center font-semibold">{item.quantity}</span>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, item.quantity + 1); }}
                                      className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-md hover:bg-brand hover:text-white transition-colors text-ink"
                                    >+</button>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={(e) => { e.stopPropagation(); removeFromCart(item.id); toast.success('تمت إزالة المنتج من السلة'); }}
                                className="text-gray-300 hover:text-brand transition-colors p-1"
                                aria-label="إزالة من السلة"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      {cartItems.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-gray-500">المجموع:</span>
                            <span className="text-brand font-bold text-lg">{formatPrice(cartTotal)}</span>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); sendOrderViaWhatsApp(); }}
                            className="btn-shine w-full bg-brand hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl transition-colors duration-300 flex items-center justify-center gap-2 shadow-brand"
                          >
                            <ShoppingCart className="h-5 w-5" />
                            اكمال الطلب
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </li>
              </ul>
            </nav>

            {/* شريط البحث للموبايل */}
            {isMobileSearchOpen && (
              <div className="fixed top-20 left-0 right-0 bg-white p-4 z-40 border-b border-gray-100 md:hidden mobile-search-container shadow-soft">
                <div className="relative">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="ابحث عن منتج..."
                    className="w-full bg-gray-50 text-ink placeholder-gray-400 py-3 px-5 pr-12 rounded-full focus:outline-none focus:ring-2 focus:ring-brand"
                  />
                  <button
                    onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-ink"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  {searchResults.length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-soft-lg border border-gray-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
                      {searchResults.map((product: any) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          className="flex items-center p-3 hover:bg-brand-50 transition-colors duration-200 border-b border-gray-50 last:border-0"
                          onClick={() => { clearSearch(); setIsMobileSearchOpen(false); }}
                        >
                          <div className="w-10 h-10 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={product.displayImage}
                              alt={product.title}
                              className="w-full h-full object-cover"
                              onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-product.jpg'; }}
                            />
                          </div>
                          <div className="flex-1 text-right pr-3">
                            <h4 className="text-ink font-semibold text-sm">{product.title}</h4>
                            {product.category?.name && <p className="text-xs text-gray-500">{product.category.name}</p>}
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* القائمة الجانبية للموبايل */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-80 bg-white z-50 shadow-2xl md:hidden pt-20 flex flex-col"
            ref={menuRef}
          >
            <nav className="p-5 flex-1 overflow-y-auto">
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/"
                    className="block px-5 py-4 text-lg text-ink hover:bg-brand-50 hover:text-brand rounded-xl transition-colors font-semibold"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    الصفحة الرئيسية
                  </Link>
                </li>

                <li className="mt-6">
                  <div className="px-5 py-2 text-brand text-sm font-bold uppercase tracking-wide">
                    الأقسام
                  </div>
                  {loadingCategories ? (
                    <div className="px-5 py-4 text-gray-400 text-center">جاري التحميل...</div>
                  ) : categories.length > 0 ? (
                    <ul>
                      {categories.map((category) => (
                        <li key={category.id}>
                          <Link
                            to={`/category/${category.id}`}
                            className="flex items-center gap-3 px-5 py-3.5 text-ink hover:bg-brand-50 hover:text-brand rounded-xl transition-colors font-medium"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            {category.image_url && <img src={category.image_url} alt={category.name} className="w-9 h-9 rounded-lg object-cover" />}
                            {category.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-5 py-4 text-gray-400 text-center">لا توجد أقسام متاحة</div>
                  )}
                </li>
              </ul>
            </nav>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-brand hover:text-white rounded-xl text-ink transition-colors font-medium"
              >
                <X className="h-5 w-5" />
                <span>إغلاق القائمة</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* الخلفية المعتمة */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
