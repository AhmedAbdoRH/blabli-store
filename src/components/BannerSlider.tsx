import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { Banner } from '../types/database';

interface BannerSliderProps {
  banners: Banner[];
}

const SLIDE_INTERVAL = 5000;

export default function BannerSlider({ banners }: BannerSliderProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setFadeIn(true), 50);
    return () => clearTimeout(t);
  }, []);

  const goTo = useCallback((idx: number) => {
    setCurrent((idx + banners.length) % banners.length);
  }, [banners.length]);

  const next = useCallback(() => goTo(current + 1), [current, goTo]);

  // التشغيل التلقائي
  useEffect(() => {
    if (banners.length <= 1 || isPaused) return;
    timeoutRef.current && clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => next(), SLIDE_INTERVAL);
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, [current, banners.length, isPaused, next]);

  if (!banners.length) return null;

  // حساب موضع كل بانر بالنسبة للبانر الحالي (coverflow 3D)
  const getPosition = (idx: number) => {
    const diff = idx - current;
    // تطوي المصفوفة لجعلها دائرية
    let pos = diff;
    if (pos > banners.length / 2) pos -= banners.length;
    if (pos < -banners.length / 2) pos += banners.length;
    return pos;
  };

  return (
    <div
      className={`relative w-full overflow-hidden fade-in-banner${fadeIn ? ' fade-in-active' : ''}`}
      style={{
        marginTop: 'var(--header-height, 4.9rem)',
        height: 'clamp(520px, 85vh, 920px)',
        perspective: '1600px',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <style>{`
        .fade-in-banner {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.9s cubic-bezier(.4,0,.2,1), transform 0.9s cubic-bezier(.4,0,.2,1);
        }
        .fade-in-banner.fade-in-active {
          opacity: 1;
          transform: translateY(0);
        }
        .banner-3d-wrap {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 76%;
          height: 80%;
          transform-style: preserve-3d;
        }
        @media (max-width: 768px) {
          .banner-3d-wrap {
            width: 90%;
            height: 84%;
          }
        }
        @media (max-width: 480px) {
          .banner-3d-wrap {
            width: 94%;
            height: 88%;
          }
        }
      `}</style>

      {/* الإضاءة الخلفية المتوهجة - تعكس لون البانر النشط */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(ellipse at center, rgba(15, 72, 125, 0.25) 0%, rgba(7, 37, 68, 0.1) 40%, transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* منصة عاكسة سفلية */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2"
        style={{
          width: '70%',
          height: '120px',
          background: 'radial-gradient(ellipse at center top, rgba(15,72,125,0.18), transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {banners.map((banner, idx) => {
          const pos = getPosition(idx);
          const isActive = pos === 0;
          const absPos = Math.abs(pos);

          // إخفاء البانرات البعيدة
          const isVisible = absPos <= 2;

          // إعدادات التحويل ثلاثي الأبعاد
          const rotateY = pos * -55;        // دوران جانبي
          const translateX = pos * 52;       // إزاحة أفقية (% من الحاوية)
          const translateZ = isActive ? 60 : -Math.abs(pos) * 180; // عمق
          const scale = isActive ? 1 : 0.78;
          const zIndex = 100 - absPos;
          const opacity = absPos === 0 ? 1 : absPos === 1 ? 0.7 : absPos === 2 ? 0.3 : 0;

          return (
            <div key={banner.id} className="banner-3d-wrap" style={{ pointerEvents: isVisible ? 'auto' : 'none' }}>
            <motion.div
              initial={false}
              animate={{
                opacity: isVisible ? opacity : 0,
                x: `${translateX}%`,
                rotateY,
                z: translateZ,
                scale,
                zIndex,
                filter: isActive ? 'brightness(1) saturate(1.1)' : `brightness(${0.55 - absPos * 0.1}) saturate(0.8)`,
              }}
              transition={{
                duration: 0.9,
                ease: [0.16, 1, 0.3, 1],
                opacity: { duration: 0.5 },
              }}
              onClick={() => {
                if (!isActive) goTo(idx);
              }}
              style={{
                width: '100%',
                height: '100%',
                cursor: isActive ? 'default' : 'pointer',
                transformStyle: 'preserve-3d',
                transformOrigin: 'center center',
              }}
            >
              <div
                className="relative w-full h-full rounded-3xl overflow-hidden"
                style={{
                  boxShadow: isActive
                    ? '0 50px 100px -20px rgba(15,72,125,0.55), 0 30px 60px -30px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.08)'
                    : '0 30px 70px -25px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.05)',
                  transformStyle: 'preserve-3d',
                }}
              >
                {/* محتوى البانر */}
                {banner.type === 'image' && banner.image_url ? (
                  <img
                    src={banner.image_url}
                    alt={banner.title || 'Banner'}
                    className="w-full h-full object-cover object-center"
                    style={{ backfaceVisibility: 'hidden' }}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-brand-deep via-brand to-brand-600 p-6 sm:p-12 text-center">
                    {banner.title && (
                      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black mb-3 text-white" style={{ lineHeight: '1.2' }}>
                        {banner.title}
                      </h1>
                    )}
                    {banner.description && (
                      <p className="text-base sm:text-xl text-white/90 max-w-2xl" style={{ lineHeight: '1.7' }}>
                        {banner.description}
                      </p>
                    )}
                  </div>
                )}

                {/* توهج داخلي على الحواف للبانر النشط */}
                {isActive && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      boxShadow: 'inset 0 0 80px rgba(255,255,255,0.12)',
                    }}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}

                {/* انعكاس زجاجي علوي */}
                <div
                  className="absolute inset-x-0 top-0 h-1/3 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)',
                  }}
                />
              </div>

              {/* ظل/انعكاس سفلي للبانر النشط */}
              {isActive && (
                <div
                  className="absolute left-0 right-0 -bottom-1 h-6 rounded-3xl"
                  style={{
                    background: 'rgba(15,72,125,0.4)',
                    filter: 'blur(24px)',
                    transform: 'scaleY(-1)',
                    opacity: 0.5,
                  }}
                />
              )}
            </motion.div>
            </div>
          );
        })}
      </div>

      {/* أزرار التنقل ونقاط التقدم محذوفة - انتقال تلقائي فقط */}
    </div>
  );
}
