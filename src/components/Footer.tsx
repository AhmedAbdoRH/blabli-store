import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Snail as Snapchat, Youtube, Phone, MessageCircle, MapPin, Mail } from 'lucide-react';
import type { StoreSettings } from '../types/database';

interface FooterProps {
  storeSettings?: StoreSettings | null;
}

export default function Footer({ storeSettings }: FooterProps) {
  const socialLinks = [
    { url: storeSettings?.facebook_url, icon: Facebook, label: 'Facebook' },
    { url: storeSettings?.instagram_url, icon: Instagram, label: 'Instagram' },
    { url: storeSettings?.twitter_url, icon: Twitter, label: 'Twitter' },
    { url: storeSettings?.snapchat_url, icon: Snapchat, label: 'Snapchat' },
    { url: storeSettings?.tiktok_url, icon: Youtube, label: 'TikTok' },
  ].filter((link) => link.url);

  return (
    <footer className="relative bg-ink text-white overflow-hidden">
      {/* زخرفة علوية */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand via-brand-300 to-brand"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 py-14 relative z-10">
        <div className="grid md:grid-cols-3 gap-10 mb-10">
          {/* العمود الأول: من نحن */}
          <div className="md:col-span-1">
            <img src="/logo.jpeg" alt="blabli" className="h-14 w-auto mb-5 rounded-lg" />
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map((link, index) => (
                  link.url && (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-brand text-white transition-all duration-300 hover:scale-110"
                      title={link.label}
                      aria-label={link.label}
                    >
                      <link.icon className="h-5 w-5" />
                    </a>
                  )
                ))}
              </div>
            )}
          </div>

          {/* العمود الثاني: روابط سريعة */}
          <div>
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand rounded-full"></span>
              روابط سريعة
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/" className="hover:text-brand transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-3 h-px bg-brand transition-all duration-300"></span>
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link to="/#products" className="hover:text-brand transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-3 h-px bg-brand transition-all duration-300"></span>
                  المنتجات
                </Link>
              </li>
              <li>
                <a href="https://wa.me/201099490594" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors duration-300 flex items-center gap-2 group">
                  <span className="w-0 group-hover:w-3 h-px bg-brand transition-all duration-300"></span>
                  تواصل معنا
                </a>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: تواصل */}
          <div>
            <h3 className="text-lg font-bold mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-brand rounded-full"></span>
              تواصل معنا
            </h3>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 flex-shrink-0">
                  <Phone className="h-4 w-4 text-brand-300" />
                </div>
                <a href="tel:01222582955" dir="ltr" className="hover:text-brand transition-colors">0122 258 2955</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 flex-shrink-0">
                  <MessageCircle className="h-4 w-4 text-brand-300" />
                </div>
                <a href="https://wa.me/201099490594" target="_blank" rel="noopener noreferrer" className="hover:text-brand transition-colors">واتساب: 01099490594</a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 flex-shrink-0">
                  <MapPin className="h-4 w-4 text-brand-300" />
                </div>
                <span>القاهرة، مصر</span>
              </li>
            </ul>
          </div>
        </div>

        {/* خط فاصل */}
        <div className="divider-gradient mb-6 opacity-30"></div>

        {/* الحقوق */}
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-gray-400 text-sm">جميع الحقوق محفوظة © {new Date().getFullYear()} blabli</p>
          <div className="flex items-center gap-4">
            <a href="https://RHM-Digital.com" className="flex items-center gap-2 bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-lg transition-colors" target="_blank" rel="noopener noreferrer">
              <img
                src="https://res.cloudinary.com/dvikey3wc/image/upload/v1777537041/RH_PRODUCTION_-_%D8%A7%D9%84%D9%87%D9%88%D9%8A%D8%A9_3_klfr9t.png"
                alt="RHM Digital Solutions"
                className="h-5 w-auto"
              />
              <span className="text-white font-semibold text-sm">RHM Digital Solutions</span>
            </a>
            <Link to="/admin/login" className="text-gray-500 hover:text-brand transition-colors text-sm">
              لوحة التحكم
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
