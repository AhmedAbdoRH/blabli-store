/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // === الهوية اللونية الجديدة ===
        ink: '#1d1d1d',        // أسود فاخر (بدل الأسود الحالك)
        brand: {
          DEFAULT: '#0f487d',  // الأزرق الأساسي (Royal Blue)
          light: '#1a6bb0',    // أزرق أفتح للتدرجات
          deep: '#0a3258',     // أزرق غامق
          50: '#eef5fb',
          100: '#d6e6f5',
          200: '#aecde9',
          300: '#7fb0da',
          400: '#4a8ec6',
          500: '#1a6bb0',
          600: '#0f487d',
          700: '#0a3258',
          800: '#072544',
          900: '#04162b',
        },
        // أسماء قديمة مدعومة للتوافق
        primary: '#1d1d1d',
        secondary: '#ffffff',
        accent: '#0f487d',
        'accent-blue': '#0f487d',
        'accent-black': '#1d1d1d',
      },
      fontFamily: {
        cairo: ['Cairo', 'Tajawal', 'sans-serif'],
        sans: ['Cairo', 'Tajawal', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        none: '0px',
      },
      boxShadow: {
        'brand': '0 10px 40px -10px rgba(15, 72, 125, 0.35)',
        'brand-lg': '0 25px 60px -15px rgba(15, 72, 125, 0.45)',
        'soft': '0 8px 30px rgba(29, 29, 29, 0.08)',
        'soft-lg': '0 20px 50px rgba(29, 29, 29, 0.12)',
        'glow': '0 0 30px rgba(15, 72, 125, 0.4)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 6s ease infinite',
      },
    },
  },
  plugins: [],
};
