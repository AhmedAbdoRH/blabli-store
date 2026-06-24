import { motion } from 'framer-motion';
import { Shield, Sparkles, Award, ArrowLeft, Sword, Target, Crown, Quote } from 'lucide-react';

const traits = [
  { icon: Sword, label: 'الشجاعة' },
  { icon: Shield, label: 'الثبات' },
  { icon: Target, label: 'الطموح' },
  { icon: Crown, label: 'القيادة' },
];

const highlights = [
  { icon: Sparkles, title: 'خامات فاخرة', desc: 'أجود أنواع الأقمشة' },
  { icon: Shield, title: 'قوة الفارس', desc: 'راحة ومتانة' },
  { icon: Award, title: 'هوية لا تُنسى', desc: 'تصميمات حصرية' },
];

export default function About() {
  return (
    <section className="relative min-h-[700px] md:min-h-[760px] flex items-center overflow-hidden py-28 bg-[#05070d]">
      {/* خلفية متعددة الطبقات */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#080d1a] to-brand-deep opacity-95" />
      
      {/* تأثير الضوضاء الخفيف (Texture) لإعطاء طابع القماش */}
      <div 
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* شبكة نقطية */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        }}
      />

      {/* خطوط عمودية زخرفية */}
      <div className="absolute inset-y-0 right-[10%] w-px bg-gradient-to-b from-transparent via-brand-300/10 to-transparent hidden lg:block" />
      <div className="absolute inset-y-0 left-[10%] w-px bg-gradient-to-b from-transparent via-brand-300/10 to-transparent hidden lg:block" />

      {/* توهج ضوئي */}
      <div className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-brand/15 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-brand-deep/40 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-center max-w-7xl mx-auto">
          
          {/* المحتوى النصي */}
          <motion.div
            className="lg:col-span-7 text-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            {/* شارة */}
            <motion.div
              className="inline-flex items-center gap-3 px-5 py-2 bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-full mb-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center w-2 h-2 bg-brand-300 rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.5)]" />
              <span className="text-white/80 text-xs font-bold tracking-[0.3em] uppercase">
                الهوية · القوة · الأناقة
              </span>
            </motion.div>

            {/* العنوان */}
            <h1 className="text-4xl md:text-6xl lg:text-[5rem] font-black leading-[1.1] mb-8 tracking-tight">
              <span className="block text-white drop-shadow-2xl">اصنع هويتك</span>
              <span className="block bg-gradient-to-l from-brand-300 via-brand-100 to-white/80 bg-clip-text text-transparent mt-2">
                بكل ثقة
              </span>
            </h1>

            {/* خط فاصل زخرفي */}
            <motion.div
              className="flex items-center gap-4 mb-8"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.9, delay: 0.4 }}
              viewport={{ once: true }}
              style={{ transformOrigin: 'right center' }}
            >
              <div className="h-px w-16 bg-gradient-to-l from-brand-300 to-transparent" />
              <span className="text-brand-300 text-sm font-bold tracking-[0.2em] uppercase">من نحن</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
            </motion.div>

            {/* الوصف */}
            <p className="text-lg text-white/70 leading-[1.9] max-w-2xl mb-8 font-light">
              <span className="text-brand-300 font-bold">Blabli</span> ليس مجرد اسم — بل هو تعبير عن
              الرجل الذي يصنع هويته بنفسه. رجل يسعى للنجاح، يؤمن بالقوة والانضباط، ويعتبر الأناقة امتدادًا لشخصيته.
            </p>

            {/* اقتباس مميز */}
            <motion.div
              className="relative bg-white/[0.02] backdrop-blur-sm border-r-2 border-brand-300 p-6 rounded-l-2xl mb-10 max-w-2xl overflow-hidden group"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute inset-0 bg-gradient-to-l from-brand-300/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Quote className="absolute top-4 left-4 w-8 h-8 text-brand-300/20 rotate-180" />
              <p className="text-white/90 text-lg leading-relaxed italic pr-10 relative z-10">
                استُلهِمت روح البراند من صفات{' '}
                <span className="font-bold text-white not-italic">الفارس</span>: الشجاعة، والثبات، والطموح —
                في كل قطعة، قوة هادئة تجمع بين الراحة والأناقة العصرية.
              </p>
            </motion.div>

            {/* صفات الفارس كشارات */}
            <div className="flex flex-wrap gap-3 mb-10">
              {traits.map((trait, i) => (
                <motion.div
                  key={trait.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/[0.03] backdrop-blur-md border border-white/10 rounded-full text-white/90 text-sm font-semibold hover:bg-white/[0.06] hover:border-brand-300/30 transition-all duration-300 cursor-default"
                >
                  <trait.icon className="w-4 h-4 text-brand-300" strokeWidth={2.5} />
                  <span>{trait.label}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap items-center gap-6"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="#products"
                className="group relative inline-flex items-center gap-3 bg-white text-ink font-bold px-8 py-4 rounded-2xl shadow-[0_10px_40px_-10px_rgba(255,255,255,0.3)] overflow-hidden"
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10 tracking-wide">اكتشف المجموعة</span>
                <ArrowLeft className="w-5 h-5 relative z-10 group-hover:-translate-x-1 transition-transform duration-300" />
                {/* لمعان */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-brand-100/50 to-transparent" />
              </motion.a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-semibold text-sm transition-colors border-b border-transparent hover:border-white/30 pb-1"
              >
                <span>تواصل معنا</span>
                <ArrowLeft className="w-4 h-4" />
              </a>
            </motion.div>
          </motion.div>

          {/* الكروت العائمة - تم تحسين الهيكل لتجنب التداخل */}
          <motion.div
            className="lg:col-span-5 relative h-[500px] md:h-[540px] hidden lg:block"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* توهج خلفي للكروت */}
            <div className="absolute inset-0 bg-brand/10 blur-3xl rounded-full" />

            {/* البطاقة الرئيسية */}
            <motion.div
              className="absolute top-1/2 right-0 w-[340px] -translate-y-1/2 bg-gradient-to-br from-brand/80 via-brand-600 to-brand-deep p-8 rounded-[2rem] shadow-2xl shadow-brand/30 overflow-hidden border border-white/10"
              animate={{ y: ["-50%", "-54%", "-50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              {/* عناصر زخرفية داخل البطاقة */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/20 rounded-full blur-2xl" />
              <div className="absolute inset-0 border border-white/10 rounded-[2rem] pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-center w-16 h-16 bg-white/15 rounded-2xl mb-6 backdrop-blur-md border border-white/20">
                  <Shield className="w-8 h-8 text-white" strokeWidth={1.8} />
                </div>
                <h3 className="text-4xl font-black text-white mb-3 tracking-tight">روح الفارس</h3>
                <p className="text-white/80 text-base leading-relaxed mb-6 font-light">
                  قطع مستوحاة من الشجاعة والثبات والطموح لتعكس شخصيتك الفريدة.
                </p>
                <div className="h-px w-full bg-gradient-to-l from-transparent via-white/30 to-transparent" />
                <p className="text-brand-100 text-xs font-bold tracking-[0.3em] uppercase mt-5">
                  هوية · قوة · أناقة
                </p>
              </div>
            </motion.div>

            {/* الكروت الصغيرة */}
            {highlights.map((card, i) => {
              const positions = [
                { top: '40px', left: '0px' },     // أعلى اليسار
                { bottom: '60px', left: '20px' }, // أسفل اليسار
                { bottom: '150px', right: '-20px' } // يمين منتصف القاع
              ];
              const pos = positions[i];
              
              return (
                <motion.div
                  key={card.title}
                  className="absolute bg-white/95 backdrop-blur-xl p-5 rounded-2xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] w-60 border border-white/50"
                  style={{
                    top: pos.top,
                    bottom: pos.bottom,
                    left: pos.left,
                    right: pos.right,
                    zIndex: 20 - i,
                  }}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.6 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                  viewport={{ once: true }}
                  animate={{
                    y: [0, i % 2 === 0 ? -8 : 8, 0],
                    transition: { duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }
                  }}
                  whileHover={{ scale: 1.05, zIndex: 50, transition: { duration: 0.2 } }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center justify-center w-10 h-10 bg-brand/10 rounded-xl border border-brand/20">
                      <card.icon className="w-5 h-5 text-brand" strokeWidth={2} />
                    </div>
                    <h4 className="font-black text-ink text-base">{card.title}</h4>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* خطوط أفقية علوية وسفلية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-brand-300/50 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-px bg-gradient-to-r from-transparent via-brand-300/50 to-transparent" />
    </section>
  );
}