import React, { useEffect, useState, useCallback } from 'react';
import ServiceCard from './ServiceCard';
import { supabase } from '../lib/supabase';
import type { Service, Category } from '../types/database';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const lightGold = '#FFD700';
const brownDark = '#3d2c1d';
const accentColor = '#d99323';

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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

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

      // Fetch all services with their categories
      const { data, error } = await supabase
        .from('services')
        .select(`
          *,
          category:categories(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);

      // Check if we have any featured or best seller products
      const hasFeatured = data?.some(service => service.is_featured) || false;
      const hasBestSellers = data?.some(service => service.is_best_seller) || false;
      
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
    
    if (selectedCategory === 'featured') {
      return services.filter(service => service.is_featured === true);
    }
    
    if (selectedCategory === 'best_sellers') {
      return services.filter(service => service.is_best_seller === true);
    }
    
    return services.filter(service => service.category_id === selectedCategory);
  }, [selectedCategory, services]);

  // عند تغيير الفئة، أعد تعيين العدد المرئي إلى 20
  useEffect(() => {
    setVisibleCount(20);
  }, [selectedCategory]);

  const visibleServices = filteredServices().slice(0, visibleCount);
  const canShowMore = visibleCount < filteredServices().length;

  if (isLoading) {
    return (
      <div className={`py-16 bg-gradient-to-br from-[${brownDark}] to-black`}>
        <div className="container mx-auto px-4 text-center text-white">
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`py-16 bg-gradient-to-br from-[${brownDark}] to-black`}>
        <div className="container mx-auto px-4 text-center text-red-600">
          حدث خطأ أثناء تحميل الملابس: {error}
        </div>
      </div>
    );
  }

  return (
    <section className={`py-16 bg-white`} id="products">
      <motion.div
        className="container mx-auto px-4"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.8, delayChildren: 0.3, staggerChildren: 0.2 } },
        }}
      >
        {/* Category Buttons - All in one line */}
        <motion.div
          className="flex flex-wrap gap-2 justify-center mb-12"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
        >
          {/* All Products Button */}
          <motion.button
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 transition-all duration-300 text-sm font-medium ${
              !selectedCategory
                ? `bg-red-500 text-white`
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            جميع الملابس
          </motion.button>

          {/* Featured Products Category */}
          {hasFeaturedProducts && (
            <motion.button
              onClick={() => setSelectedCategory('featured')}
              className={`px-6 py-2 transition-all duration-300 text-sm font-medium ${
                selectedCategory === 'featured'
                  ? `bg-red-500 text-white`
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              أحدث العروض
            </motion.button>
          )}

          {/* Best Sellers Category */}
          {hasBestSellerProducts && (
            <motion.button
              onClick={() => setSelectedCategory('best_sellers')}
              className={`px-6 py-2 transition-all duration-300 text-sm font-medium ${
                selectedCategory === 'best_sellers'
                  ? `bg-red-500 text-white`
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              الأكثر مبيعاً
            </motion.button>
          )}

          {/* Regular Categories */}
          <AnimatePresence>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2 transition-all duration-300 text-sm font-medium flex items-center gap-2 ${
                  category.id === selectedCategory
                    ? `bg-red-500 text-white`
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {category.image_url && <img src={category.image_url} alt={category.name} className="w-5 h-5 rounded-full object-cover" />}
                {category.name}
              </motion.button>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Products Grid - Auto-wrap with equal distribution */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
          }}
        >
          <AnimatePresence mode="wait">
            {visibleServices.length > 0 ? (
              visibleServices.map((service) => (
                <motion.div
                  key={service.id}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                    exit: { opacity: 0, y: -20 }
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
                  />
                </motion.div>
              ))
            ) : (
              <motion.div
                key="no-services"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full text-center text-gray-600 text-xl"
                transition={{ duration: 0.5 }}
              >
                لا توجد منتجات في هذه الفئة.
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Show More Button */}
        {canShowMore && (
          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={() => setVisibleCount(c => c + 20)}
              className="px-8 py-3 bg-red-500 text-white font-bold text-lg rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              عرض المزيد
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}