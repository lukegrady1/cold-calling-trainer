import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  // Safelist dynamic grade-color classes that are built at runtime.
  safelist: [
    'bg-emerald-600', 'bg-amber-600', 'bg-rose-600',
    'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
    'bg-emerald-600/20', 'bg-amber-600/20', 'bg-rose-600/20',
    'border-emerald-500', 'border-amber-500', 'border-rose-500',
    'border-emerald-700', 'border-amber-700', 'border-rose-700',
    'border-emerald-700/40', 'border-amber-700/40', 'border-rose-700/40',
    'hover:border-emerald-700', 'hover:border-amber-700', 'hover:border-rose-700',
    'shadow-emerald-900/30', 'shadow-amber-900/30', 'shadow-rose-900/30',
    'text-emerald-300', 'text-amber-300', 'text-rose-300',
    'text-emerald-400', 'text-amber-400', 'text-rose-400',
  ],
  plugins: [],
};

export default config;
