import { motion } from 'framer-motion';
import { Award, Users, Sparkles, ShieldCheck, ArrowLeft } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'خاماتنا',
    desc: 'أجود أنواع الأقمشة وأكثرها تنوعاً لتناسب كافة بيئات العمل',
  },
  {
    icon: Award,
    title: 'رؤيتنا',
    desc: 'مظهر الفريق هو المرآة التي تعكس احترافية المؤسسة',
  },
  {
    icon: Users,
    title: 'شموليتنا',
    desc: 'نلبي احتياجات الشركات والمطاعم والمدارس بأعلى معايير الجودة',
  },
];

export default function About() {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* زخارف خلفية فاخرة */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-50 rounded-full blur-3xl opacity-60 -translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-100/40 rounded-full blur-3xl opacity-50 translate-x-1/3 translate-y-1/3"></div>

      <motion.div
        className="container mx-auto px-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
      >
        <div className="grid lg:grid-cols-2 gap-14 items-center max-w-6xl mx-auto">
          {/* البطاقة الرئيسية */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="relative group">
              {/* توهج أزرق عند المرور */}
              <div className="absolute -inset-1 bg-gradient-to-br from-brand to-brand-deep rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition duration-700"></div>

              {/* البطاقة الرئيسية */}
              <div className="relative bg-gradient-to-br from-brand via-brand-600 to-brand-deep p-10 md:p-12 rounded-3xl shadow-brand-lg overflow-hidden">
                {/* عناصر زخرفية */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-52 h-52 bg-brand-300/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                  {/* شارة الخبرة */}
                  <motion.div
                    className="inline-flex items-center gap-3 bg-white/15 backdrop-blur-sm px-5 py-3 rounded-full mb-7 border border-white/20"
                    whileHover={{ scale: 1.05 }}
                  >
                    <div className="bg-white p-2 rounded-full">
                      <Award className="w-5 h-5 text-brand" />
                    </div>
                    <span className="text-white font-bold text-lg">20+ عاماً من الخبرة</span>
                  </motion.div>

                  <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-5">
                    عشرون عاماً من الخبرة..
                  </h3>
                  <p className="text-2xl md:text-4xl font-black text-white/90 mb-7">
                    نصنع ثقة فريقك
                  </p>

                  <div className="h-px bg-gradient-to-l from-transparent via-white/40 to-transparent mb-6"></div>

                  <p className="text-white/90 text-lg leading-relaxed mb-8">
                    الشريك الاستراتيجي لأكبر الشركات في السوق المصري
                  </p>

                  <div className="flex items-center gap-3 text-white/80 text-sm">
                    <ShieldCheck className="h-5 w-5" />
                    <span>جودة مضمونة بأعلى المعايير العالمية</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* بطاقات المميزات */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <div className="mb-10">
              <span className="inline-block text-brand font-bold text-sm tracking-wider uppercase mb-3">لماذا blabli؟</span>
              <h3 className="text-4xl font-black text-ink mb-4 flex items-center gap-4">
                <span className="w-2 h-12 bg-gradient-to-b from-brand to-brand-deep rounded-full"></span>
                لماذا نحن؟
              </h3>
              <div className="h-1 w-24 bg-gradient-to-r from-brand to-brand-300 rounded-full"></div>
            </div>

            <div className="space-y-5">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className="card-premium group p-7 rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * (index + 1) }}
                  viewport={{ once: true }}
                >
                  <div className="flex gap-5 items-start">
                    <div className="flex-shrink-0">
                      <motion.div
                        className="flex items-center justify-center h-14 w-14 rounded-xl bg-gradient-to-br from-brand to-brand-deep shadow-brand group-hover:shadow-brand-lg transition-shadow"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="w-7 h-7 text-white" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-ink text-lg mb-2">{feature.title}</h4>
                      <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-brand opacity-0 group-hover:opacity-100 group-hover:-translate-x-1 transition-all" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
