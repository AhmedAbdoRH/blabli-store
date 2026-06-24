import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, ShoppingBag, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
  price: string;
  salePrice?: string | null;
  id: string | number;
}

export default function ProductCard({ title, description, imageUrl, price, salePrice, id }: ProductCardProps) {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const productUrl = `${window.location.origin}/product/${id}`;
    const message = `استفسار عن المنتج: ${title}\nرابط المنتج: ${productUrl}`;
    window.open(`https://wa.me/201099490594?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsAdding(true);
    addToCart({ id, title, price: salePrice || price, imageUrl });
    setIsAdded(true);
    setTimeout(() => {
      setIsAdding(false);
      setTimeout(() => setIsAdded(false), 2000);
    }, 600);
  };

  // حساب نسبة الخصم
  const discount = salePrice && price
    ? Math.round((1 - parseFloat(salePrice) / parseFloat(price)) * 100)
    : 0;

  return (
    <div
      className="group card-premium flex flex-col bg-white rounded-2xl overflow-hidden"
      dir="rtl"
    >
      {/* الصورة */}
      <Link to={`/product/${id}`} className="relative block aspect-[3/4] w-full overflow-hidden bg-gray-50">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* بادج الخصم */}
        {salePrice && (
          <div className="absolute top-3 right-3 bg-brand text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-brand z-10 flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
            </span>
            خصم {discount}%
          </div>
        )}
      </Link>

      {/* التفاصيل */}
      <div className="flex flex-col flex-1 p-4">
        <Link to={`/product/${id}`} className="block flex-1 mb-4">
          <h3 className="text-ink font-bold text-base line-clamp-1 mb-1 group-hover:text-brand transition-colors duration-300">
            {title}
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            {salePrice ? (
              <>
                <span className="font-black text-brand text-lg tracking-tight">{salePrice} ج.م</span>
                <span className="text-sm font-medium text-gray-400 line-through decoration-gray-300">{price}</span>
              </>
            ) : (
              <span className="font-black text-ink text-lg tracking-tight">{price} ج.م</span>
            )}
          </div>
        </Link>

        {/* الأزرار */}
        <div className="grid grid-cols-2 gap-2 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isAdding || isAdded}
            className={`relative flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-sm font-bold transition-all duration-300 overflow-hidden
              ${isAdded
                ? 'bg-green-500 text-white'
                : 'bg-ink text-white hover:bg-brand hover:shadow-brand btn-shine'
              }`}
            title="أضف إلى السلة"
          >
            {isAdding ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : isAdded ? (
              <>
                <Check className="h-4 w-4" />
                <span>تمت</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>للسلة</span>
              </>
            )}
          </button>

          <button
            onClick={handleContactClick}
            className="flex items-center justify-center gap-1.5 bg-brand hover:bg-brand-deep text-white py-2.5 px-2 rounded-xl transition-all duration-300 text-sm font-bold shadow-brand hover:shadow-brand-lg active:scale-95"
            title="اطلب الآن"
          >
            <MessageCircle className="h-4 w-4" />
            <span>اطلب</span>
          </button>
        </div>
      </div>
    </div>
  );
}
