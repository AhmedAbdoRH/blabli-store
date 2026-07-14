import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Service } from '../types/database';
import { MessageCircle, ShoppingBag, Share2, Check, ArrowRight, ShieldCheck, Truck, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<Service[]>([]);

  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchService(id);
      fetchSuggested();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [id]);

  const fetchService = async (serviceId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase.from('services').select('*').eq('id', serviceId).single();
      if (fetchError) throw fetchError;
      if (!data) throw new Error('المنتج غير موجود');
      setService(data);
      setCurrentImage(0);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggested = async () => {
    const { data } = await supabase.from('services').select('*').neq('id', id).limit(8);
    setSuggested(data || []);
  };

  const handleContact = () => {
    if (!service) return;
    const productUrl = window.location.href;
    const message = `استفسار عن المنتج: ${service.title}\nرابط المنتج: ${productUrl}`;
    window.open(`https://wa.me/201099490594?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async () => {
    if (!service) return;
    const shareData = {
      title: service.title,
      text: `شاهد هذه القطعة الأنيقة: ${service.title}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); return; } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text}\n${shareData.url}`)}`, '_blank');
  };

  const handleAddToCart = () => {
    if (!service) return;
    setIsAdding(true);
    // Prefer sale price when available (same as product cards)
    const cartPrice = service.sale_price || service.price || '';
    addToCart({ id: service.id, title: service.title, price: cartPrice, imageUrl: service.image_url || '' });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setIsAdded(false), 2000);
    }, 600);
  };

  const images: string[] = [
    service?.image_url || '',
    ...(Array.isArray(service?.gallery) ? service.gallery : []),
  ].filter(Boolean);

  const nextImage = () => images.length > 1 && setCurrentImage((p) => (p + 1) % images.length);
  const prevImage = () => images.length > 1 && setCurrentImage((p) => (p - 1 + images.length) % images.length);

  const ogImage = service?.image_url && service.image_url.trim() !== '' ? service.image_url : '/screenshot.jpg';

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center pt-24" dir="rtl">
        <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-6 pt-24" dir="rtl">
        <div className="text-xl text-ink font-medium">{error || 'عذراً، المنتج غير موجود'}</div>
        <button onClick={() => navigate('/')} className="bg-brand text-white px-8 py-3 rounded-xl font-medium hover:bg-brand-deep transition-colors shadow-brand">
          العودة للرئيسية
        </button>
      </div>
    );
  }

  const trustBadges = [
    { icon: ShieldCheck, title: 'جودة مضمونة', desc: 'خامات فاخرة 100%' },
    { icon: Truck, title: 'توصيل سريع', desc: 'لجميع المحافظات' },
    { icon: Award, title: 'خبرة 20 عاماً', desc: 'ثقة آلاف العملاء' },
  ];

  return (
    <>
      <Helmet>
        <meta property="og:title" content={service.title} />
        <meta property="og:description" content={service.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-16" dir="rtl">
        {/* زر العودة */}
        <div className="container mx-auto px-4 max-w-6xl mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-brand transition-colors text-sm font-semibold group"
          >
            <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            رجوع
          </button>
        </div>

        {/* بطاقة المنتج الرئيسية */}
        <div className="container mx-auto px-4 max-w-6xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white rounded-[2rem] shadow-soft-lg border border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col lg:flex-row">
              {/* قسم الصور */}
              <div className="w-full lg:w-1/2 relative bg-gray-50">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {images.map((img, idx) => (
                    <motion.img
                      key={idx}
                      src={img}
                      alt={`${service.title} - صورة ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out ${
                        currentImage === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
                      }`}
                      draggable={false}
                    />
                  ))}

                  {/* أسهم التنقل بين الصور */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md hover:bg-brand hover:text-white text-ink p-2.5 rounded-full shadow-soft transition-all duration-300"
                        aria-label="الصورة السابقة"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/80 backdrop-blur-md hover:bg-brand hover:text-white text-ink p-2.5 rounded-full shadow-soft transition-all duration-300"
                        aria-label="الصورة التالية"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* عداد الصور */}
                  {images.length > 1 && (
                    <div className="absolute top-4 left-4 z-20 bg-ink/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {currentImage + 1} / {images.length}
                    </div>
                  )}

                  {/* مؤشرات الصور */}
                  {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`rounded-full transition-all duration-300 ${
                            currentImage === idx ? 'bg-brand w-5 h-2' : 'bg-ink/40 w-2 h-2'
                          }`}
                          onClick={() => setCurrentImage(idx)}
                          aria-label={`الصورة رقم ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* الصور المصغّرة */}
                {images.length > 1 && (
                  <div className="hidden lg:flex gap-3 p-4 bg-white border-t border-gray-100">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentImage(idx)}
                        className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                          currentImage === idx ? 'border-brand shadow-brand' : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`صورة ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* قسم التفاصيل */}
              <div className="w-full lg:w-1/2 p-7 lg:p-12 flex flex-col">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      {service.category_id && (
                        <span className="inline-block text-brand text-xs font-bold tracking-wider uppercase mb-2">منتج مميز</span>
                      )}
                      <h1 className="text-2xl lg:text-4xl font-black text-ink leading-tight">{service.title}</h1>
                    </div>
                    <button
                      onClick={handleShare}
                      className="p-2.5 text-gray-400 hover:text-brand hover:bg-brand-50 bg-gray-50 rounded-full transition-colors shrink-0"
                      title="مشاركة المنتج"
                      aria-label="مشاركة"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-baseline gap-3 mb-8">
                    {service.sale_price ? (
                      <>
                        <span className="text-3xl lg:text-4xl font-black text-brand tracking-tight">{service.sale_price} ج.م</span>
                        <span className="text-lg font-medium text-gray-400 line-through decoration-gray-300">{service.price} ج.م</span>
                      </>
                    ) : (
                      <span className="text-3xl lg:text-4xl font-black text-brand tracking-tight">{service.price} ج.م</span>
                    )}
                    <div className="divider-gradient flex-1 mx-2"></div>
                  </div>

                  <div className="mb-10">
                    <h3 className="text-sm font-bold text-ink mb-3 flex items-center gap-2">
                      <span className="w-1 h-4 bg-brand rounded-full"></span>
                      تفاصيل القطعة
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm lg:text-base whitespace-pre-line">
                      {service.description}
                    </p>
                  </div>

                  {/* شارات الثقة */}
                  <div className="grid grid-cols-3 gap-3 mb-8">
                    {trustBadges.map((badge, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="text-center p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <badge.icon className="w-6 h-6 text-brand mx-auto mb-2" />
                        <div className="text-xs font-bold text-ink">{badge.title}</div>
                        <div className="text-[10px] text-gray-500 mt-0.5">{badge.desc}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* الأزرار */}
                <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
                  <motion.button
                    onClick={handleAddToCart}
                    disabled={isAdding || isAdded}
                    whileTap={{ scale: 0.98 }}
                    className={`btn-shine w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold transition-all duration-300 ${
                      isAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-brand text-white hover:bg-brand-deep shadow-brand hover:shadow-brand-lg'
                    }`}
                  >
                    {isAdding ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : isAdded ? (
                      <>
                        <Check className="h-5 w-5" />
                        <span>تمت الإضافة للسلة</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="h-5 w-5" />
                        <span>أضف إلى سلة التسوق</span>
                      </>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={handleContact}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-2xl font-bold text-ink bg-white border-2 border-gray-200 hover:border-brand hover:text-brand hover:bg-brand-50 transition-all duration-300"
                  >
                    <MessageCircle className="h-5 w-5 text-green-600" />
                    <span>استفسر أو اطلب عبر الواتساب</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* قسم قد يعجبك أيضاً */}
        {suggested.length > 0 && (
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="inline-block text-brand font-bold text-sm tracking-wider uppercase mb-1">اكتشف المزيد</span>
                <h2 className="text-2xl lg:text-3xl font-black text-ink">قد يعجبك أيضاً</h2>
              </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar -mx-4 px-4 snap-x">
              {suggested.map((item) => {
                const itemImages = [item.image_url || '', ...(Array.isArray(item.gallery) ? item.gallery : [])].filter(Boolean);
                const imageUrl = itemImages[0] || '';
                return (
                  <div
                    key={item.id}
                    className="group min-w-[180px] md:min-w-[230px] cursor-pointer snap-start"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-gray-100 shadow-soft group-hover:shadow-brand-lg transition-all duration-500">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <h3 className="text-sm font-bold text-ink truncate mb-1 group-hover:text-brand transition-colors">{item.title}</h3>
                    <div className="flex items-baseline gap-2 text-sm">
                      {item.sale_price ? (
                        <>
                          <span className="font-black text-brand">{item.sale_price} ج.م</span>
                          <span className="text-gray-400 line-through text-xs">{item.price} ج.م</span>
                        </>
                      ) : (
                        <span className="font-black text-brand">{item.price} ج.م</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
