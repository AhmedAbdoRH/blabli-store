import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import type { Service } from '../types/database';
import { MessageCircle, ShoppingBag, Share2, Check, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCart } from '../contexts/CartContext'; // تأكد من مسار الكونتيكست الخاص بك

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [suggested, setSuggested] = useState<Service[]>([]);
  
  // حالات زر السلة
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // حالة الصور
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
      const { data, error: fetchError } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (fetchError) throw fetchError;
      if (!data) throw new Error('المنتج غير موجود');

      setService(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSuggested = async () => {
    const { data } = await supabase
      .from('services')
      .select('*')
      .neq('id', id)
      .limit(8);
    setSuggested(data || []);
  };

  const handleContact = () => {
    if (!service) return;
    const productUrl = window.location.href;
    const message = `استفسار عن المنتج: ${service.title}\nرابط المنتج: ${productUrl}`;
    window.open(`https://wa.me/201099490594?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = () => {
    if (!service) return;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`شاهد هذه القطعة الأنيقة: ${service.title}\n${window.location.href}`)}`;
    window.open(shareUrl, '_blank');
  };

  const handleAddToCart = () => {
    if (!service) return;
    setIsAdding(true);
    addToCart({
      id: service.id,
      title: service.title,
      price: service.price,
      imageUrl: service.image_url || '',
    });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setIsAdded(false), 2000);
    }, 600);
  };

  const images: string[] = [
    service?.image_url || '',
    ...(Array.isArray(service?.gallery) ? service.gallery : [])
  ].filter(Boolean);

  // تقليب الصور التلقائي البطيء والناعم
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images.length]);

  const defaultScreenshot = '/screenshot.jpg';
  const ogImage = service?.image_url && service.image_url.trim() !== '' ? service.image_url : defaultScreenshot;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-24" dir="rtl">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 pt-24" dir="rtl">
        <div className="text-xl text-gray-800 font-medium">{error || 'عذراً، المنتج غير موجود'}</div>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
        >
          العودة للرئيسية
        </button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <meta property="og:title" content={service.title} />
        <meta property="og:description" content={service.description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:type" content="product" />
      </Helmet>

      <div className="min-h-screen bg-[#FCFCFC] pt-24 pb-12 font-sans" dir="rtl">
        
        {/* زر العودة العلوي */}
        <div className="container mx-auto px-4 max-w-6xl mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4" />
            رجوع
          </button>
        </div>

        {/* كارت تفاصيل المنتج */}
        <div className="container mx-auto px-4 max-w-6xl mb-16">
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex flex-col lg:flex-row">
              
              {/* قسم الصور (يمين) */}
              <div className="w-full lg:w-1/2 relative bg-gray-100">
                <div className="relative aspect-[3/4] w-full overflow-hidden">
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${service.title} - صورة ${idx + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out ${
                        currentImage === idx 
                          ? 'opacity-100 scale-100 z-10' 
                          : 'opacity-0 scale-105 z-0'
                      }`}
                      draggable={false}
                    />
                  ))}
                  
                  {/* مؤشرات الصور (Dots) */}
                  {images.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20 bg-white/30 backdrop-blur-md px-3 py-1.5 rounded-full">
                      {images.map((_, idx) => (
                        <button
                          key={idx}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            currentImage === idx ? 'bg-gray-900 w-4' : 'bg-gray-900/40'
                          }`}
                          onClick={() => setCurrentImage(idx)}
                          aria-label={`الصورة رقم ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* قسم التفاصيل (يسار) */}
              <div className="w-full lg:w-1/2 p-6 lg:p-12 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-2xl lg:text-3xl font-black text-gray-900 leading-tight">
                    {service.title}
                  </h1>
                  {/* زر المشاركة كأيقونة أنيقة */}
                  <button 
                    onClick={handleShare}
                    className="p-2 text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors shrink-0"
                    title="مشاركة المنتج"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="text-3xl font-black text-brand mb-8 tracking-tight">
                  {service.price} ج.م
                </div>

                <div className="prose prose-gray max-w-none mb-10">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">تفاصيل القطعة:</h3>
                  <p className="text-gray-600 leading-relaxed text-sm lg:text-base whitespace-pre-line">
                    {service.description}
                  </p>
                </div>

                {/* منطقة الأزرار في أسفل الشاشة (تتمدد لتأخذ المساحة المتبقية) */}
                <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding || isAdded}
                    className={`w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                      isAdded
                        ? 'bg-green-500 text-white'
                        : 'bg-brand text-white hover:bg-brand-deep hover:shadow-xl hover:shadow-brand/30'
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
                        <span>أضف إلى حقيبة التسوق</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleContact}
                    className="w-full flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold text-ink bg-white border-2 border-gray-200 hover:border-brand hover:text-brand hover:bg-brand-50 transition-all duration-300"
                  >
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <span>استفسر أو اطلب عبر الواتساب</span>
                  </button>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        {/* قسم قد يعجبك أيضاً */}
        {suggested.length > 0 && (
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">قد يعجبك أيضاً</h2>
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-6 hide-scrollbar -mx-4 px-4 snap-x">
              {suggested.map((item) => {
                const itemImages = [item.image_url || '', ...(Array.isArray(item.gallery) ? item.gallery : [])].filter(Boolean);
                const imageUrl = itemImages[0] || '';

                return (
                  <div
                    key={item.id}
                    className="group min-w-[160px] md:min-w-[220px] cursor-pointer snap-start"
                    onClick={() => navigate(`/product/${item.id}`)}
                  >
                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3 bg-gray-100">
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                      />
                    </div>
                    <h3 className="text-sm font-bold text-gray-900 truncate mb-1 group-hover:text-brand transition-colors">
                      {item.title}
                    </h3>
                    <div className="text-sm font-black text-gray-600">
                      {item.price} ج.م
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <style>{`
          .hide-scrollbar {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </>
  );
}