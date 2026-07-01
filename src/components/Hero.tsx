import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          className="text-center max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold text-brand mb-6 leading-tight">
            Blabli
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            <span className="text-brand font-bold">هوية</span> تصنعها{' '}
            <span className="text-brand font-bold">أنت</span>. قطع تحتفي بـ
            <span className="text-brand font-bold"> شخصيتك</span>، وتعبّر عن
            <span className="text-brand font-bold"> قوة</span> حضورك في كل مرة
            <span className="text-brand font-bold"> ترتديها</span>.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
