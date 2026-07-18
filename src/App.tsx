import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from './lib/supabase';
import { CartProvider } from './contexts/CartContext';
import Cart from './components/Cart';
import Header from './components/Header';
import BannerSlider from './components/BannerSlider';
import About from './components/About';
import Services from './components/Services';
import Footer from './components/Footer';
import Testimonials from './components/Testimonials';
import WhatsAppButton from './components/WhatsAppButton';
import CategoryCards from './components/CategoryCards';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import ServiceDetails from './pages/ServiceDetails';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetails from './pages/ProductDetails';
import LoadingScreen from './components/LoadingScreen';
import InstallPWA from './components/InstallPWA';
import type { StoreSettings, Banner } from './types/database';
import { ThemeProvider } from './theme/ThemeContext';

// PrivateRoute component with professional loading spinner
function PrivateRoute({ children }: { children: React.ReactNode }) {
 const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

 useEffect(() => {
 checkAuth();

 const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
 setIsAuthenticated(!!session);
 });

 return () => subscription.unsubscribe();
 }, []);

 async function checkAuth() {
 const { data: { session } } = await supabase.auth.getSession();
 setIsAuthenticated(!!session);
 }

 if (isAuthenticated === null) {
 return (
 <div className="loading-spinner-container">
 <div className="loading-spinner"></div>
 <p className="loading-spinner-text"> </p>
 </div>
 );
 }

 return isAuthenticated ? (
 <>{children}</>
 ) : (
 <Navigate to="/admin/login" replace />
 );
}

function App() {
 const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
 const [loading, setLoading] = useState(true);
 const [banners, setBanners] = useState<Banner[]>([]);
 const [mainContentLoaded, setMainContentLoaded] = useState(false);

 useEffect(() => {
 let isMounted = true;
 async function initApp() {
 await fetchStoreSettings();
 const { data: bannersData, error: bannersError } = await supabase
 .from('banners')
 .select('*')
 .order('created_at', { ascending: false });

 if (isMounted) {
 if (bannersError) {
 console.error("Error fetching banners:", bannersError);
 setBanners([]);
 } else {
 setBanners(bannersData || []);
 }
 }

 // Wait for at least 2 seconds OR until settings are fetched, whichever is longer
 // This part is primarily for the initial LoadingScreen, not PrivateRoute
 const timer = setTimeout(() => {
 if (isMounted) setLoading(false);
 }, 2000); // Minimum 2 seconds for initial loading screen

 return () => {
 isMounted = false;
 clearTimeout(timer);
 };
 }
 initApp();
 return () => { isMounted = false; };
 }, []);

 useEffect(() => {
 // الهوية اللونية الموحدة (أبيض/أسود #1d1d1d/أزرق #0f487d)
 const root = document.documentElement;
 root.style.setProperty('--color-primary', '#1d1d1d');
 root.style.setProperty('--color-secondary', '#ffffff');
 root.style.setProperty('--color-accent', '#0f487d');
 root.style.setProperty('--color-accent-light', '#1a6bb0');
 root.style.setProperty('--color-accent-deep', '#0a3258');
 root.style.setProperty('--font-family', 'Cairo, sans-serif');
 root.style.setProperty('--background-color', '#ffffff');
 root.style.setProperty('--background-gradient', '');
 }, [storeSettings]);

 const fetchStoreSettings = async () => {
 const { data, error } = await supabase
 .from('store_settings')
 .select('*')
 .single();

 if (error) {
 console.error("Error fetching store settings:", error);
 // Potentially set some default settings or handle error state
 return;
 }
 if (data) {
 setStoreSettings(data);
 }
 };

 interface LayoutProps {
 children: React.ReactNode;
 banners: Banner[];
 }

 const Layout = ({ children, banners: layoutBanners }: LayoutProps) => ( // Renamed banners prop to avoid conflict
 <div
 className="min-h-screen font-cairo" // Ensure font-cairo is defined in tailwind.config.js if used like this
 style={{
 background: '#ffffff',
 backgroundSize: 'cover',
 backgroundRepeat: 'no-repeat',
 backgroundAttachment: 'fixed',
 }}
 >
 <Header />
 {window.location.pathname === '/' && layoutBanners.length > 0 && (
 <BannerSlider banners={layoutBanners} />
 )}
 <MainFade>{children}</MainFade>
 {window.location.pathname === '/' && storeSettings?.show_testimonials && (
 <Testimonials />
 )}
 <Footer storeSettings={storeSettings} />
 <WhatsAppButton />
 <InstallPWA />
 </div>
 );

 if (loading) {
 return (
 <LoadingScreen
 logoUrl={'/logo.jpeg'}
 
 />
 );
 }

 return (
 <ThemeProvider>
 <CartProvider>
 <Helmet>
 <title>{storeSettings?.meta_title || storeSettings?.store_name || 'blabli'}</title>
 <meta name="description" content={storeSettings?.meta_description || storeSettings?.store_description || 'الأناقة والاحترافية في عالم الأزياء الموحدة'} />
 <link rel="icon" type="image/jpeg" href="/logo.jpeg" />
 {storeSettings?.keywords && storeSettings.keywords.length > 0 && (
 <meta name="keywords" content={storeSettings.keywords.join(', ')} />
 )}
 {storeSettings?.og_image_url && (
 <meta property="og:image" content={storeSettings.og_image_url} />
 )}
 <meta property="og:title" content={storeSettings?.meta_title || storeSettings?.store_name || 'blabli'} />
 <meta property="og:description" content={storeSettings?.meta_description || storeSettings?.store_description || ''} />
 <meta property="og:type" content="website" />
 </Helmet>
 <Router>
 <Routes>
 <Route path="/admin/login" element={<AdminLogin />} />
 <Route path="/admin/dashboard" element={
 <PrivateRoute>
 <AdminDashboard onSettingsUpdate={fetchStoreSettings} />
 </PrivateRoute>
 } />

 <Route path="/service/:id" element={
 <Layout banners={banners}>
 <ServiceDetails />
 </Layout>
 } />
 <Route path="/product/:id" element={
 <Layout banners={banners}>
 <ProductDetails />
 </Layout>
 } />
 <Route path="/category/:categoryId" element={
 <Layout banners={banners}>
 <CategoryProducts />
 </Layout>
 } />
 <Route path="/" element={
 <Layout banners={banners}>
 <StaggeredHome
 storeSettings={storeSettings}
 banners={banners}
 setMainContentLoaded={setMainContentLoaded}
 />
 </Layout>
 } />
 </Routes>
 </Router>
 </CartProvider>
 </ThemeProvider>
 );
}

function StaggeredHome({
 storeSettings,
 banners, // This prop is received but not directly used in this simplified version
 setMainContentLoaded,
}: {
 storeSettings: StoreSettings | null;
 banners: Banner[];
 setMainContentLoaded: (v: boolean) => void;
}) {
 useEffect(() => {
 setMainContentLoaded(true); // Signal that content related to StaggeredHome is ready
 }, [setMainContentLoaded]);

 return (
 <>
 {/* About section is part of the staggered load */}
 <About />
 <CategoryCards />
 {/* Services component is part of the staggered load */}
 <Services />
 {/* You can add more home page sections here to stagger them if needed */}
 </>
 );
}

function MainFade({ children }: { children: React.ReactNode }) {
 const [visible, setVisible] = useState(false);
 useEffect(() => {
 const t = setTimeout(() => setVisible(true), 50); // Quick fade-in for content
 return () => clearTimeout(t);
 }, []);
 return (
 <div
 className="main-fade-content" // Added class for specific styling if needed
 style={{
 opacity: visible ? 1 : 0,
 transform: visible ? 'translateY(0)' : 'translateY(16px)',
 transition: 'opacity 1200ms cubic-bezier(.4,0,.2,1), transform 700ms cubic-bezier(.4,0,.2,1)',
 }}
 >
 {children}
 </div>
 );
}

export default App;
