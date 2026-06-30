import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Category } from '../types/database';

export default function CategoryCards() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('خطأ في جلب الأقسام:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4">
        {/* عنوان القسم */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-black text-ink mb-3">أقسامنا المميزة</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-brand rounded-full"></span>
            <span className="w-2 h-1 bg-brand rounded-full"></span>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {categories.map((category) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
              }}
            >
              <Link
                to={`/category/${category.id}`}
                className="group block relative aspect-[3/4] rounded-3xl overflow-hidden shadow-soft hover:shadow-brand-lg transition-all duration-500 hover:-translate-y-2"
              >
                {category.image_url ? (
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-deep to-brand" />
                )}

                {/* تراكب متدرج أنيق */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

                {/* إطار أزرق يظهر عند المرور */}
                <div className="absolute inset-0 border-2 border-brand opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <motion.h3
                    className="text-white font-bold text-lg md:text-xl drop-shadow-lg"
                    whileHover={{ x: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    {category.name}
                  </motion.h3>
                  {category.description && (
                    <p className="text-white/70 text-xs mt-1 line-clamp-1">{category.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3 text-brand-200 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 translate-x-4 transition-all duration-500">
                    <span className="text-sm font-semibold">تسوق الآن</span>
                    <ArrowLeft className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
