import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Lock, Mail } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) navigate('/admin/dashboard');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError('');
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) navigate('/admin/dashboard');
    } catch (err: any) {
      let userFriendlyError = err.message;
      if (err.message.includes('Invalid login credentials')) userFriendlyError = 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
      else if (err.message.includes('Email not confirmed')) userFriendlyError = 'البريد الإلكتروني غير مؤكد. يرجى التحقق من صندوق الوارد.';
      setError(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-deep via-brand to-brand-600 flex items-center justify-center p-4 relative overflow-hidden">
      {/* زخارف خلفية */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-300/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md">
        {/* اللوجو */}
        <div className="text-center mb-8">
          <img src="/logo.jpeg" alt="blabli" className="h-16 w-auto mx-auto rounded-xl shadow-lg" />
        </div>

        {/* بطاقة تسجيل الدخول */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <h2 className="text-2xl font-black text-ink mb-2 text-center">تسجيل الدخول</h2>
          <p className="text-gray-500 text-sm text-center mb-6">لوحة التحكم الإدارية</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-ink text-sm font-semibold mb-2">البريد الإلكتروني</label>
              <div className="relative">
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pr-11 rounded-xl text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-gray-50 border border-gray-200 transition-colors"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-ink text-sm font-semibold mb-2">كلمة المرور</label>
              <div className="relative">
                <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-11 rounded-xl text-ink placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent bg-gray-50 border border-gray-200 transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-shine w-full bg-brand text-white py-3.5 rounded-xl hover:bg-brand-deep transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed font-bold shadow-brand"
            >
              {isLoading ? 'جاري تسجيل الدخول...' : 'دخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
