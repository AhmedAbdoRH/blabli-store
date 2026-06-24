import { useEffect, useState, useCallback } from 'react';
import ServiceCard from './ServiceCard';
import { supabase } from '../lib/supabase';
import type { Service, Category } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | 'featured' | 'best_sellers' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasFeaturedProducts, setHasFeaturedProducts] = useState(false);
  const [hasBestSellerProducts, setHasBestSellerProducts] = useState(false);
  const [visibleCount, setVisibleCount] = useState(20);

  useEffect(() => {
    fetchCategories();
    fetchServices();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const fetchServices = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('services')
        .select(`*, category:categories(*), product_images(image_url)`)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setServices(data || []);
      const hasFeatured = data?.some((service: any) => service.is_featured) || false;
      const hasBestSellers = data?.some((service: any) => service.is_best_seller) || false;
      setHasFeaturedProducts(hasFeatured);
      setHasBestSellerProducts(hasBestSellers);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredServices = useCallback((): Service[] => {
    if (!selectedCategory) return services;
    if (selectedCategory === 'featured') return services.filter((s) => s.is_featured === true);
    if (selectedCategory === 'best_sellers') return services.filter((s) => s.is_best_seller === true);
    return services.filter((s) => s.category_id === selectedCategory);
  }, [selectedCategory, services]);

  useEffect(() => {
    setVisibleCount(20);
  }, [selectedCategory]);

  const visibleServices = filteredServices().slice(0, visibleCount);
  const canShowMore = visibleCount < filteredServices().length;

  if (isLoading) {
    return (
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="aspect-[3/4] rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center text-brand font-semibold">
          حدث خطأ أثناء تحميل المنتجات: {error}
        </div>
      </div>
    );
  }

  const FilterButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.95 }}
      className={`px-6 py-2.5 rounded-full transition-all duration-300 text-sm font-semibold border ${
        active
          ? 'bg-brand text-white border-brand shadow-brand'
          : 'bg-white text-ink border-gray-200 hover:border-brand hover:text-brand'
      }`}
    >
      {children}
    </motion.button>
  );

  return (
    <section className="py-20 bg-white" id="products">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
        }}
      >
        {/* عنوان القسم */}
        <div className="text-center mb-12">
          <span className="inline-block text-brand font-bold text-sm tracking-wider uppercase mb-3">مجموعتنا</span>
          <h2 className="text-3xl md:text-4xl font-black text-ink mb-3">أحدث المنتجات</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-12 h-1 bg-brand rounded-full"></span>
            <span className="w-2 h-1 bg-brand rounded-full"></span>
          </div>
        </div>

        {/* أزرار الفلترة */}
        <motion.div
          className="flex flex-wrap gap-2.5 justify-center mb-12"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
        >
          <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
            <FilterButton active={!selectedCategory} onClick={() => setSelectedCategory(null)}>
              جميع المنتجات
            </FilterButton>
          </motion.div>

          {hasFeaturedProducts && (
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <FilterButton active={selectedCategory === 'featured'} onClick={() => setSelectedCategory('featured')}>
                أحدث العروض
              </FilterButton>
            </motion.div>
          )}

          {hasBestSellerProducts && (
            <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
              <FilterButton active={selectedCategory === 'best_sellers'} onClick={() => setSelectedCategory('best_sellers')}>
                الأكثر مبيعاً
              </FilterButton>
            </motion.div>
          )}

          <AnimatePresence>
            {categories.map((category) => (
              <motion.div
                key={category.id}
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              >
                <FilterButton
                  active={category.id === selectedCategory}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="flex items-center gap-2">
                    {category.image_url && <img src={category.image_url} alt={category.name} className="w-5 h-5 rounded-full object-cover" />}
                    {category.name}
                  </span>
                </FilterButton>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* شبكة المنتجات */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
        >
          <AnimatePresence mode="wait">
            {visibleServices.length > 0 ? (
              visibleServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <ServiceCard
                    id={service.id}
                    title={service.title}
                    description={service.description || ''}
                    imageUrl={service.image_url || ''}
                    price={service.price || ''}
                    salePrice={service.sale_price || null}
                    extraImages={(service as any).product_images?.map((img: any) => img.image_url).filter(Boolean) || []}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="no-services"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center text-gray-500 text-xl py-16"
              >
                لا توجد منتجات في هذه الفئة.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* زر عرض المزيد */}
        {canShowMore && (
          <motion.div
            className="flex justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setVisibleCount((c) => c + 20)}
              className="btn-shine px-10 py-3.5 bg-ink hover:bg-brand text-white font-bold text-lg rounded-full transition-colors duration-300 shadow-soft-lg"
            >
              عرض المزيد
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
