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
    <section className="relative min-h-[800px] md:min-h-[900px] flex items-center justify-center overflow-hidden py-32 bg-[#020208]">
      
      {/* الشبكة ثلاثية الأبعاد العميقة */}
      <div 
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          transform: 'perspective(800px) rotateX(60deg) translateY(-10%) scale(2.5)',
          transformOrigin: 'center top',
          maskImage: 'radial-gradient(ellipse at center top, black 0%, transparent 60%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center top, black 0%, transparent 60%)',
        }}
      />

      {/* توهجات ضوئية متحركة (Aurora) */}
      <motion.div 
        className="absolute top-[-20%] left-[5%] w-[600px] h-[600px] bg-brand/10 rounded-full blur-[150px] pointer-events-none"
        animate={{ x: [0, 100, 0], y: [0, 50, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-[-20%] right-[5%] w-[500px] h-[500px] bg-brand-deep/20 rounded-full blur-[150px] pointer-events-none"
        animate={{ x: [0, -80, 0], y: [0, -40, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* خطوط عمودية ذهبية */}
      <div className="absolute top-0 bottom-0 left-[15%] w-px bg-gradient-to-b from-transparent via-brand-200/20 to-transparent hidden lg:block" />
      <div className="absolute top-0 bottom-0 right-[15%] w-px bg-gradient-to-b from-transparent via-brand-200/20 to-transparent hidden lg:block" />

      {/* الحصان - العنصر البصري الرئيسي في الخلفية */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <style>{`
          @keyframes horse-x {
            0%   { transform: translate(calc(-50% - 200px), 0) scale(1);     opacity: 0.08; }
            25%  { transform: translate(calc(-50% - 100px), 0) scale(1.04);  opacity: 0.14; }
            50%  { transform: translate(calc(-50% + 200px), 0) scale(1.08);  opacity: 0.20; }
            75%  { transform: translate(calc(-50% + 100px), 0) scale(1.04);  opacity: 0.14; }
            100% { transform: translate(calc(-50% - 200px), 0) scale(1);     opacity: 0.08; }
          }
          @keyframes horse-y {
            0%   { transform: translate(-50%, calc(-50% - 20px)); }
            50%  { transform: translate(-50%, calc(-50% + 20px)); }
            100% { transform: translate(-50%, calc(-50% - 20px)); }
          }
          .horse-wrap {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            will-change: transform;
            animation: horse-y 120s linear infinite;
          }
          .horse-main {
            position: absolute;
            top: 50%;
            left: 50%;
            filter: invert(1) brightness(2.5);
            mix-blend-mode: screen;
            width: clamp(600px, 80vw, 1000px);
            height: auto;
            will-change: transform, opacity;
            animation: horse-x 90s linear infinite;
          }
          @media (max-width: 768px) {
            .horse-main {
              width: 600px;
            }
          }
        `}</style>
        <div className="horse-wrap">
          <img
            src="/horse.png"
            alt=""
            className="horse-main"
          />
        </div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-20 items-center max-w-7xl mx-auto">
          
          {/* المحتوى النصي */}
          <motion.div
            className="lg:col-span-7 text-right"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            {/* شارة فاخرة */}
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-full mb-10 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="w-2 h-2 bg-brand-300 rounded-full shadow-[0_0_15px_4px_rgba(255,255,255,0.8)] animate-pulse" />
              <span className="text-white/70 text-xs font-bold tracking-[0.4em] uppercase">
                The Knight's Identity
              </span>
            </motion.div>

            {/* العنوان الخرافي */}
            <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-black leading-[1.05] mb-10 tracking-tighter">
              <span className="block text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]">اصنع هويتك</span>
              <span className="block mt-3 bg-gradient-to-r from-white via-brand-100 to-brand-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(255,255,255,0.2)]">
                بكل ثقة
              </span>
            </h1>

            {/* تقسيم فاخر */}
            <div className="flex items-center gap-4 mb-10">
              <div className="h-px w-20 bg-gradient-to-l from-brand-300 to-transparent" />
              <span className="text-brand-200 text-sm font-bold tracking-[0.3em] uppercase">من نحن</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent via-white/10 to-white/10" />
            </div>

            {/* الوصف */}
            <p className="text-lg md:text-xl text-white/60 leading-[2] max-w-2xl mb-8 font-light">
              <span className="text-brand-300 font-bold">Blabli</span> ليس مجرد اسم — بل هو تعبير عن
              الرجل الذي يصنع هويته بنفسه. رجل يسعى للنجاح، يؤمن بالقوة والانضباط، ويعتبر الأناقة امتدادًا لشخصيته.
            </p>

            {/* الاقتباس */}
            <motion.div
              className="relative bg-gradient-to-l from-white/[0.03] to-transparent backdrop-blur-md border-r-2 border-brand-300 p-6 rounded-l-2xl mb-10 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-brand-300 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
              <Quote className="absolute top-6 left-6 w-10 h-10 text-white/5 rotate-180" />
              <p className="text-white/90 text-xl leading-relaxed italic pr-12 font-light">
                استُلهِمت روح البراند من صفات الفارس: الشجاعة، والثبات، والطموح —
                في كل قطعة، قوة هادئة تجمع بين الراحة والأناقة العصرية.
              </p>
            </motion.div>

            {/* الشارات */}
            <div className="flex flex-wrap gap-3 mb-12">
              {traits.map((trait, i) => (
                <motion.div
                  key={trait.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + i * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4, borderColor: 'rgba(255,255,255,0.3)', boxShadow: '0 10px 30px -10px rgba(255,255,255,0.1)' }}
                  className="inline-flex items-center gap-2.5 px-5 py-3 bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl text-white/80 text-sm font-semibold transition-all duration-300 cursor-default"
                >
                  <trait.icon className="w-4 h-4 text-brand-300" strokeWidth={2} />
                  <span>{trait.label}</span>
                </motion.div>
              ))}
            </div>

            {/* الأزرار */}
            <motion.div
              className="flex flex-wrap items-center gap-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.a
                href="#products"
                className="group relative inline-flex items-center gap-3 bg-white text-ink font-bold px-10 py-5 rounded-2xl shadow-[0_20px_50px_-10px_rgba(255,255,255,0.3)] overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: "0px 25px 60px -10px rgba(255,255,255,0.4)" }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 tracking-wide text-lg">اكتشف المجموعة</span>
                <ArrowLeft className="w-6 h-6 relative z-10 group-hover:-translate-x-2 transition-transform duration-300" />
                {/* لمعان سينمائي */}
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out bg-gradient-to-r from-transparent via-black/10 to-transparent" />
              </motion.a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-white/70 hover:text-white font-bold text-base transition-colors border-b-2 border-transparent hover:border-brand-300 pb-1"
              >
                <span>تواصل معنا</span>
                <ArrowLeft className="w-5 h-5" />
              </a>
            </motion.div>
          </motion.div>

          {/* الكروت الخرافية (النظام المداري) */}
          <motion.div
            className="lg:col-span-5 relative h-[600px] hidden lg:flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            viewport={{ once: true }}
          >
            {/* توهج مركزي خلفي */}
            <div className="absolute w-[300px] h-[300px] bg-brand/10 blur-[100px] rounded-full" />

            {/* حلقات مدارية دوارة */}
            <motion.div 
              className="absolute w-[400px] h-[400px] border border-white/5 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute top-0 left-1/2 w-3 h-3 bg-brand-300 rounded-full shadow-[0_0_15px_4px_rgba(255,255,255,0.5)] -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
            <motion.div 
              className="absolute w-[500px] h-[500px] border border-white/5 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <div className="absolute bottom-0 right-1/4 w-2 h-2 bg-brand-deep rounded-full shadow-[0_0_10px_3px_rgba(255,255,255,0.3)]" />
            </motion.div>

            {/* البطاقة المركزية (زجاجية فاخرة) */}
            <motion.div
              className="absolute z-20 w-[340px] bg-gradient-to-br from-[#0a0e1a]/90 to-[#05070d]/90 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              whileHover={{ scale: 1.05, rotateY: 10, rotateX: -10 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* إطار داخلي مضيء */}
              <div className="absolute inset-2 border border-white/5 rounded-[1.5rem] pointer-events-none" />
              {/* توهج علوي */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-brand/20 blur-[80px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-2xl mb-6 border border-white/10 backdrop-blur-sm">
                  <Shield className="w-10 h-10 text-brand-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" strokeWidth={1.5} />
                </div>
                <h3 className="text-4xl font-black text-white mb-4 tracking-tight">روح الفارس</h3>
                <p className="text-white/60 text-base leading-relaxed mb-8 font-light">
                  قطع مستوحاة من الشجاعة والثبات والطموح لتعكس شخصيتك الفريدة.
                </p>
                
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-brand-200 text-xs font-bold tracking-[0.3em] uppercase">الهوية</span>
                  <span className="text-brand-200 text-xs font-bold tracking-[0.3em] uppercase">القوة</span>
                  <span className="text-brand-200 text-xs font-bold tracking-[0.3em] uppercase">الأناقة</span>
                </div>
              </div>
            </motion.div>

            {/* الكروت الفرعية العائمة */}
            {highlights.map((card, i) => {
              // مواقع استراتيجية متفرقة حول البطاقة المركزية
              const positions = [
                { top: '50px', left: '-20px' },       
                { bottom: '80px', left: '20px' },     
                { top: '120px', right: '-30px' }      
              ];
              const pos = positions[i];
              
              return (
                <motion.div
                  key={card.title}
                  className="absolute z-30 w-52 bg-[#060810]/80 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.8)]"
                  style={{
                    top: pos.top,
                    bottom: pos.bottom,
                    left: pos.left,
                    right: pos.right,
                  }}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ 
                    duration: 0.8, 
                    delay: 0.8 + i * 0.2, 
                    ease: [0.16, 1, 0.3, 1],
                    y: { duration: 5 + i, repeat: Infinity, ease: 'easeInOut' } 
                  }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, borderColor: 'rgba(255,255,255,0.3)', zIndex: 50 }}
                >
                  {/* لمعة على الحافة */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
                        <card.icon className="w-5 h-5 text-brand-300" strokeWidth={2} />
                      </div>
                      <h4 className="font-black text-white text-sm tracking-wide">{card.title}</h4>
                    </div>
                    <p className="text-white/50 text-xs leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* خطوط أفقية مضيئة */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-brand-300/30 to-transparent" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-brand-300/30 to-transparent" />
    </section>
  );
}