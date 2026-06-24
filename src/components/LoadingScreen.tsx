import React, { useEffect, useState } from 'react';

export default function LoadingScreen({
  logoUrl,
  onFinish,
}: {
  logoUrl?: string;
  onFinish?: () => void;
}) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);

  // العبارات التي ستظهر وتتغير أثناء التحميل
  const loadingPhrases = [
    "نُجهز أحدث الموديلات...",
    "نختار لكِ أجمل القطع...",
    "الأناقة في الطريق إليكِ..."
  ];

  // إعدادات الوقت
  const FADE_START_DELAY = 2800; // متى يبدأ الاختفاء
  const HIDE_DELAY = 3500; // متى تختفي الشاشة تماماً

  useEffect(() => {
    let isMounted = true;

    if (logoUrl) {
      const img = new Image();
      img.onload = () => {
        if (isMounted) {
          setImageLoaded(true);
          setImageError(false);
        }
      };
      img.onerror = () => {
        if (isMounted) {
          setImageError(true);
          setImageLoaded(true);
        }
      };
      img.src = logoUrl;
    } else {
      if (isMounted) {
        setImageError(true);
        setImageLoaded(true);
      }
    }

    // تقليب العبارات كل 900 جزء من الثانية
    const phraseInterval = setInterval(() => {
      if (isMounted) {
        setPhraseIndex((prev) => (prev + 1) % loadingPhrases.length);
      }
    }, 900);

    const timer1 = setTimeout(() => {
      if (isMounted) setFadeOut(true);
    }, FADE_START_DELAY);

    const timer2 = setTimeout(() => {
      if (isMounted) {
        setShow(false);
        onFinish?.();
      }
    }, HIDE_DELAY);

    return () => {
      isMounted = false;
      clearInterval(phraseInterval);
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [logoUrl, onFinish]);

  if (!show) return null;

  return (
    <div
      dir="rtl"
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-all duration-700 ease-in-out ${
        fadeOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* زخرفة خلفية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-3xl opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-100/40 rounded-full blur-3xl opacity-60"></div>

      <div className="flex flex-col items-center w-full max-w-sm px-6 relative z-10">

        {/* منطقة اللوجو */}
        <div className="h-32 flex items-center justify-center mb-8">
          {imageLoaded && !imageError && logoUrl ? (
            <img
              src={logoUrl?.includes('supabase.co') ? '/logo.jpeg' : (logoUrl || '/logo.jpeg')}
              alt="Loading Logo"
              className="w-32 h-32 sm:w-40 sm:h-40 object-contain fashion-logo-reveal rounded-2xl shadow-soft-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src !== '/logo.jpeg') target.src = '/logo.jpeg';
              }}
            />
          ) : (
            <div className="tshirt-container">
              <svg
                className="w-16 h-16 text-brand tshirt-svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M8 4.5 C 8 7.5 16 7.5 16 4.5" className="tshirt-neck" />
                <path d="M8 4.5 L 3 6.5 L 4.5 11 L 7 9.5 V 21 H 17 V 9.5 L 19.5 11 L 21 6.5 L 16 4.5" className="tshirt-body" />
              </svg>
            </div>
          )}
        </div>

        {/* العبارات المتغيرة */}
        <div className="h-6 relative w-full flex justify-center overflow-hidden mb-6">
          {loadingPhrases.map((phrase, idx) => (
            <span
              key={idx}
              className={`absolute text-sm font-bold tracking-wide text-ink transition-all duration-500 ease-in-out ${
                idx === phraseIndex ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-4'
              }`}
            >
              {phrase}
            </span>
          ))}
        </div>

        {/* شريط التحميل الأزرق */}
        <div className="w-48 h-[3px] bg-gray-200 overflow-hidden rounded-full">
          <div className="h-full bg-gradient-to-r from-brand to-brand-300 progress-bar-fill rounded-full"></div>
        </div>
      </div>

      <style>{`
        /* تأثير ظهور اللوجو */
        .fashion-logo-reveal {
          animation: blur-scale-reveal 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes blur-scale-reveal {
          0% {
            opacity: 0;
            filter: blur(10px);
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
          }
        }

        /* ----- أنيميشن التي شيرت ----- */
        .tshirt-svg {
          /* حركة الطفو المستمرة للأعلى والأسفل */
          animation: float-tshirt 3s ease-in-out infinite;
        }
        
        /* رسم ياقة التي شيرت أولاً */
        .tshirt-neck {
          stroke-dasharray: 30;
          stroke-dashoffset: 30;
          animation: draw-line 1s ease-out forwards;
        }

        /* رسم جسم التي شيرت والأكمام بعد الياقة مباشرة */
        .tshirt-body {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: draw-line 1.5s ease-out 0.4s forwards;
        }

        @keyframes draw-line {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes float-tshirt {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        /* شريط التحميل */
        .progress-bar-fill {
          width: 0%;
          animation: load-progress ${FADE_START_DELAY}ms cubic-bezier(0.65, 0, 0.35, 1) forwards;
        }

        @keyframes load-progress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}