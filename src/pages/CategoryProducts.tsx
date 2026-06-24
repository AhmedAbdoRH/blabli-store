import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ServiceCard from '../components/ServiceCard';
import type { Service, Category } from '../types/database';
import { ArrowRight } from 'lucide-react';

export default function CategoryProducts() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [services, setServices] = useState<Service[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId) fetchCategoryAndServices();
  }, [categoryId]);

  const fetchCategoryAndServices = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { data: categoryData, error: categoryError } = await supabase
        .from('categories').select('*').eq('id', categoryId).single();
      if (categoryError) throw categoryError;
      setCategory(categoryData);

      const { data: servicesData, error: servicesError } = await supabase
        .from('services').select(`*, product_images(image_url)`).eq('category_id', categoryId);
      if (servicesError) throw servicesError;
      setServices(servicesData || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center bg-white" dir="rtl">
        <div className="w-10 h-10 border-3 border-brand border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="min-h-screen pt-24 flex flex-col items-center justify-center gap-4 bg-white" dir="rtl">
        <div className="text-xl text-ink font-medium">{error || 'القسم غير موجود'}</div>
        <Link to="/" className="bg-brand text-white px-6 py-3 rounded-xl hover:bg-brand-deep transition-colors font-semibold shadow-brand">
          العودة للرئيسية
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gradient-to-b from-gray-50 to-white" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand transition-colors font-semibold mb-6 group">
          <ArrowRight className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          العودة للرئيسية
        </Link>

        {/* ترويسة القسم */}
        <div className="relative overflow-hidden rounded-3xl mb-10 shadow-soft-lg">
          {category.image_url && (
            <img src={category.image_url} alt={category.name} className="absolute inset-0 w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-l from-brand-deep via-brand/85 to-brand/60"></div>
          <div className="relative z-10 p-8 md:p-12">
            <span className="inline-block text-brand-200 font-bold text-sm tracking-wider uppercase mb-2">قسم مميز</span>
            <h1 className="text-3xl md:text-5xl font-black text-white mb-3">{category.name}</h1>
            {category.description && (
              <p className="text-white/85 max-w-2xl leading-relaxed">{category.description}</p>
            )}
          </div>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-gray-400 text-lg">لا توجد منتجات في هذا القسم حالياً</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                id={service.id}
                title={service.title}
                description={service.description || ''}
                imageUrl={service.image_url || ''}
                price={service.price || ''}
                salePrice={service.sale_price || null}
                extraImages={(service as any).product_images?.map((img: any) => img.image_url).filter(Boolean) || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
