import React, { useEffect, useRef, useState } from 'react';

export default function LoadingScreen({
  logoUrl,
  onFinish,
}: {
  logoUrl?: string;
  onFinish?: () => void;
}) {
  const [show, setShow] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  // إعدادات الوقت
  const FADE_START_DELAY = 2400; // متى يبدأ الاختفاء
  const HIDE_DELAY = 3000; // متى تختفي الشاشة تماماً (3 ثواني)

  // ===== مؤقت الاختفاء =====
  useEffect(() => {
    let isMounted = true;

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
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onFinish]);

  // ===== محرك الجزيئات (Canvas) =====
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    // === Canvas يغطي الشاشة كاملة ===
    let CW = window.innerWidth;
    let CH = window.innerHeight;
    canvas.width = CW * DPR;
    canvas.height = CH * DPR;
    canvas.style.width = `${CW}px`;
    canvas.style.height = `${CH}px`;
    ctx.scale(DPR, DPR);

    // حجم التيشيرت المرسوم في المنتصف
    const SIZE = 260;
    // موقع وسط التيشيرت على الشاشة
    const cx = CW / 2 - SIZE / 2;
    const cy = CH / 2 - SIZE / 2;

    // ===== 1) رسم شكل التيشيرت على Canvas مؤقت لاستخراج النقاط =====
    const off = document.createElement('canvas');
    off.width = SIZE;
    off.height = SIZE;
    const octx = off.getContext('2d')!;

    // مسار التيشيرت (مصمم داخل مربع SIZE)
    const drawTshirtPath = (c: CanvasRenderingContext2D, s: number) => {
      const w = s;
      const h = s;
      c.beginPath();
      // إحداثيات نسبية لشكل تيشيرت أنيق
      c.moveTo(w * 0.34, h * 0.18);
      c.lineTo(w * 0.18, h * 0.26);
      c.lineTo(w * 0.10, h * 0.42);
      c.lineTo(w * 0.24, h * 0.50);
      c.lineTo(w * 0.24, h * 0.86);
      c.lineTo(w * 0.76, h * 0.86);
      c.lineTo(w * 0.76, h * 0.50);
      c.lineTo(w * 0.90, h * 0.42);
      c.lineTo(w * 0.82, h * 0.26);
      c.lineTo(w * 0.66, h * 0.18);
      c.quadraticCurveTo(w * 0.5, h * 0.30, w * 0.34, h * 0.18);
      c.closePath();
    };

    drawTshirtPath(octx, SIZE);
    octx.fillStyle = '#000';
    octx.fill();

    const imgData = octx.getImageData(0, 0, SIZE, SIZE).data;

    // ===== 2) استخراج النقاط المستهدفة من البكسلات المعبأة =====
    type Particle = {
      x: number;
      y: number;
      tx: number; // الهدف (إحداثيات الشاشة)
      ty: number;
      sx: number; // البداية (إحداثيات الشاشة)
      sy: number;
      size: number;
      delay: number;
      hue: number;
    };

    const targets: { x: number; y: number }[] = [];
    const gap = 4; // كثافة الجزيئات (أصغر = أكثف)
    for (let y = 0; y < SIZE; y += gap) {
      for (let x = 0; x < SIZE; x += gap) {
        const alpha = imgData[(y * SIZE + x) * 4 + 3];
        if (alpha > 128) {
          // الإحداثيات النهائية = موقع التيشيرت على الشاشة
          targets.push({ x: x + cx, y: y + cy });
        }
      }
    }

    // ===== 3) إنشاء الجزيئات وبعثرتها على كامل أرجاء الشاشة =====
    // الجزيئات تبدأ من أي نقطة عشوائية على الشاشة (خارج وداخل)
    // ثم تنجذب لتشكل التيشيرت في المنتصف
    const SPREAD_X = CW;
    const SPREAD_Y = CH;

    const particles: Particle[] = targets.map((t) => {
      return {
        x: 0,
        y: 0,
        sx: Math.random() * SPREAD_X,
        sy: Math.random() * SPREAD_Y,
        tx: t.x,
        ty: t.y,
        size: 0.8 + Math.random() * 1.6,
        delay: Math.random() * 0.35,
        hue: 210 + Math.random() * 30,
      };
    });

    // ===== 4) دوال المساعدة =====
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const ASSEMBLE_DURATION = FADE_START_DELAY - 600; // مدة التجمّع
    const startTime = performance.now();

    // ===== 5) حلقة الرسم =====
    const render = (now: number) => {
      const elapsed = now - startTime;
      const globalT = Math.min(elapsed / ASSEMBLE_DURATION, 1);

      // تنظيف الشاشة بالكامل (بدون مربع)
      ctx.clearRect(0, 0, CW, CH);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // تطبيق التأخير الخاص بكل جزيء
        const local = Math.max(0, Math.min((globalT - p.delay) / (1 - p.delay), 1));
        const e = easeOutCubic(local);

        p.x = p.sx + (p.tx - p.sx) * e;
        p.y = p.sy + (p.ty - p.sy) * e;

        // اهتزاز خفيف بعد التجمّع (نبض حي)
        let drawX = p.x;
        let drawY = p.y;
        if (local >= 1) {
          const wobble = Math.sin(now / 600 + i) * 0.4;
          drawX += wobble;
          drawY += Math.cos(now / 600 + i) * 0.4;
        }

        // التوهج يزداد كلما اقترب من الهدف
        const opacity = 0.25 + e * 0.75;
        ctx.beginPath();
        ctx.fillStyle = `hsla(${p.hue}, 85%, 55%, ${opacity})`;
        ctx.shadowBlur = 6 * e;
        ctx.shadowColor = `hsla(${p.hue}, 90%, 60%, ${opacity})`;
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    rafRef.current = requestAnimationFrame(render);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

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

      {/* Canvas يغطي الشاشة كاملة (بدون إطار) */}
      <canvas ref={canvasRef} className="particles-canvas" />

      {/* اللوجو في المنتصف فوق الجزيئات */}
      {logoUrl && (
        <img
          src={logoUrl?.includes('supabase.co') ? '/logo.jpeg' : logoUrl}
          alt="Logo"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 object-contain rounded-xl opacity-0 logo-soft-in pointer-events-none z-20"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== '/logo.jpeg') target.src = '/logo.jpeg';
          }}
        />
      )}

      <style>{`
        .particles-canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          display: block;
          z-index: 10;
          pointer-events: none;
        }

        /* ظهور اللوجو بهدوء بعد تجمّع الجزيئات */
        .logo-soft-in {
          animation: logo-fade ${FADE_START_DELAY}ms ease-out forwards;
        }
        @keyframes logo-fade {
          0%, 70% { opacity: 0; transform: translate(-50%, -50%) scale(0.85); }
          100% { opacity: 0.95; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
    </div>
  );
}
