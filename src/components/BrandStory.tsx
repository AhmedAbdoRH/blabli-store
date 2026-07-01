import { motion } from 'framer-motion';
import { Shield, Sword, Target, Crown, Sparkles } from 'lucide-react';

// صفات الفارس - مصدر إلهام البراند
const knightTraits = [
  {
    icon: Sword,
    title: 'الشجاعة',
    desc: 'نتحدى المألوف ونصنع قطعًا تجرؤ على التميز',
  },
  {
    icon: Shield,
    title: 'الثبات',
    desc: 'جودة لا تتزعزع في كل تفاصيل التصميم',
  },
  {
    icon: Target,
    title: 'الطموح',
    desc: 'نسعى للأفضل مهما كانت التحديات',
  },
  {
    icon: Crown,
    title: 'القيادة',
    desc: 'للرجل الذي يقود حياته بنفسه',
  },
];

export default function BrandStory() {
  return (
    <section className="relative py-28 md:py-36 bg-white overflow-hidden">
      {/* زخارف خلفية */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-brand-50 rounded-full blur-3xl opacity-40 -translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-100/30 rounded-full blur-3xl opacity-50 translate-x-1/3" />

      {/* خطوط زخرفية */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-transparent via-brand-200 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        {/* عنوان القسم */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2 bg-brand/5 border border-brand/15 rounded-full mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-brand" />
            <span className="text-brand text-sm font-bold tracking-wider">قصتنا</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-black text-ink mb-6 leading-tight">
            <span className="text-brand">Blabli</span> ليس مجرد اسم
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-brand to-brand-300 mx-auto rounded-full mb-6" />
          <p className="text-xl md:text-2xl text-ink/80 font-semibold max-w-3xl mx-auto leading-relaxed">
            بل هو تعبير عن الرجل الذي يصنع <span className="text-brand">هويته بنفسه</span>
          </p>
        </motion.div>

        {/* القصة الرئيسية - عمودين */}
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto mb-24">
          {/* النص */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-black text-ink mb-6 leading-tight">
              في عالم مليء بالتشابه، وُلدت Blabli للرجل الذي
              <span className="text-brand"> يرفض أن يكون نسخة من الآخرين</span>
            </h3>

            <p className="text-gray-700 text-lg leading-relaxed mb-5">
              رجل يسعى للنجاح.
            </p>

            <p className="text-gray-700 text-lg leading-relaxed mb-5">
              استُلهِمت روح البراند من صفات
              <span className="font-bold text-ink"> الفارس</span>:
              الشجاعة، والثبات، والطموح، والقدرة على التقدم مهما كانت التحديات.
            </p>

            <div className="relative bg-gradient-to-br from-brand-50 to-white border-r-4 border-brand p-6 rounded-2xl my-8">
              <p className="text-ink text-lg leading-relaxed font-semibold">
                كل قطعة من <span className="text-brand">Blabli</span> صُممت لتمنح الثقة،
                وتعكس القوة الهادئة، وتجمع بين الراحة والأناقة العصرية.
              </p>
            </div>

            <p className="text-gray-700 text-lg leading-relaxed">
              نحن لا نصنع ملابس فقط، بل نصنع
              <span className="font-bold text-ink"> هوية للرجل الذي يقود حياته بنفسه</span>.
            </p>
          </motion.div>

          {/* البطاقة البصرية */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative group">
              {/* توهج أزرق عند المرور */}
              <div className="absolute -inset-2 bg-gradient-to-br from-brand via-brand-600 to-brand-deep rounded-[2rem] opacity-0 group-hover:opacity-30 blur-2xl transition duration-700" />

              <div className="relative bg-gradient-to-br from-ink via-ink to-brand-deep p-10 md:p-14 rounded-[2rem] shadow-2xl overflow-hidden text-center">
                {/* عناصر زخرفية */}
                <div className="absolute top-0 right-0 w-48 h-48 bg-brand/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />

                <div className="relative z-10">
                  {/* شعار الفارس */}
                  <motion.div
                    className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-brand to-brand-deep rounded-full mb-8 shadow-2xl shadow-brand/30"
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Shield className="w-12 h-12 text-white" strokeWidth={1.5} />
                  </motion.div>

                  <div className="mb-6">
                    <h4 className="text-5xl md:text-7xl font-black text-white mb-2 tracking-tighter">
                      Blabli
                    </h4>
                    <div className="h-px w-16 bg-brand mx-auto mb-3" />
                    <p className="text-brand-200 text-sm font-bold tracking-[0.3em] uppercase">
                      هوية · قوة · أناقة
                    </p>
                  </div>

                  <p className="text-white/80 text-lg leading-relaxed max-w-sm mx-auto">
                    نصنع هوية الرجل الذي يرفض التقليد ويسعى للتميّز في كل تفاصيل حياته.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* صفات الفارس */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-black text-ink mb-3">
              روح <span className="text-brand">الفارس</span> في كل قطعة
            </h3>
            <p className="text-gray-600 text-lg">القيم التي تشكّل كل تصميم نقدمه</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {knightTraits.map((trait, i) => (
              <motion.div
                key={trait.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative bg-white border border-gray-100 p-7 rounded-2xl hover:border-brand/30 hover:shadow-brand transition-all duration-500"
              >
                {/* لمسة لون علوية عند المرور */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand to-brand-300 rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="flex items-center justify-center h-14 w-14 rounded-xl bg-brand/10 group-hover:bg-brand transition-colors duration-500 mb-5">
                  <trait.icon className="w-7 h-7 text-brand group-hover:text-white transition-colors duration-500" strokeWidth={1.8} />
                </div>
                <h4 className="font-black text-ink text-xl mb-2">{trait.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{trait.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
