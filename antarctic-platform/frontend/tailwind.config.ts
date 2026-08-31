import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ─── ANTARCTICA Design System ────────────────
        navy:   { DEFAULT: '#12233B', 700: '#1a3050', 600: '#1e3a5f', 500: '#24456e' },
        ice:    { DEFAULT: '#EAF4FC', 50: '#F5F8FB', 100: '#EFF4F9', 200: '#DCE8F5' },
        cyan:   { DEFAULT: '#2F8FE0', 50: 'rgba(47,143,224,0.12)', 100: 'rgba(47,143,224,0.2)', light: '#5BAAE8' },
        teal:   { DEFAULT: '#17A88E', 50: 'rgba(23,168,142,0.13)', light: '#1fc5a8' },
        border: { DEFAULT: '#E4EBF2', light: '#EEF3F8' },
        muted:  { DEFAULT: '#64748B', faint: '#94A3B8' },
        // Status
        green:  { DEFAULT: '#17A88E', light: 'rgba(23,168,142,0.13)' },
        amber:  { DEFAULT: '#D9A441', light: 'rgba(217,164,65,0.14)' },
        orange: { DEFAULT: '#E08A3C', light: 'rgba(224,138,60,0.14)' },
        red:    { DEFAULT: '#DC5B54', light: 'rgba(220,91,84,0.12)' },
        blue:   { DEFAULT: '#2F8FE0', light: 'rgba(47,143,224,0.12)' },
        purple: { DEFAULT: '#8B6FE0', light: 'rgba(139,111,224,0.14)' },
        // Legacy compat
        ocean: { 50: '#F0F9FF', 100: '#E0F2FE', 200: '#BAE6FD', 300: '#7DD3FC', 400: '#38BDF8', 500: '#0EA5E9', 600: '#0284C7', 700: '#0369A1', 800: '#075985', 900: '#0C4A6E' },
        arctic: { 50: '#F0F6FF', 100: '#E4EFFE', 200: '#C7DFFD' },
        slate: { 50: '#F8FAFC', 100: '#F1F5F9', 200: '#E2E8F0', 300: '#CBD5E1', 400: '#94A3B8', 500: '#64748B', 600: '#475569', 700: '#334155', 800: '#1E293B', 900: '#0F172A' },
        success: { light: '#D1FAE5', DEFAULT: '#059669', dark: '#065F46' },
        warning: { light: '#FEF3C7', DEFAULT: '#D97706', dark: '#92400E' },
        danger:  { light: '#FEE2E2', DEFAULT: '#DC2626', dark: '#7F1D1D' },
        polar: { bg: '#F5F8FB', panel: '#FFFFFF', border: '#E4EBF2' },
      },
      fontFamily: {
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'Consolas', 'monospace'],
      },
      borderRadius: {
        'lg2': '20px',
        'md2': '16px',
        'sm2': '10px',
      },
      boxShadow: {
        'card':  '0 1px 2px rgba(18,35,59,0.04), 0 1px 1px rgba(18,35,59,0.03)',
        'md':    '0 6px 20px rgba(18,35,59,0.06)',
        'lift':  '0 14px 34px rgba(18,35,59,0.12)',
        'cyan':  '0 6px 16px rgba(47,143,224,0.24)',
        'teal':  '0 6px 16px rgba(23,168,142,0.28)',
        'card-md': '0 4px 6px -1px rgba(15,23,42,0.10)',
        'card-lg': '0 10px 15px -3px rgba(15,23,42,0.10)',
        'glow-ocean': '0 0 20px rgba(3,105,161,0.20)',
      },
      backgroundImage: {
        'ocean-gradient': 'linear-gradient(135deg, #0369A1 0%, #0EA5E9 100%)',
        'navy-gradient':  'linear-gradient(135deg, #12233B, #1e3a5f)',
        'cyan-teal':      'linear-gradient(135deg, #2F8FE0, #17A88E)',
        'header-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2312233B' fill-opacity='0.025'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in':    'fadeIn 0.25s ease-out',
        'slide-in':   'slideIn 0.3s ease-out',
        'aurora':     'aurora-drift 22s ease-in-out infinite alternate',
        'pulse-dot':  'pulseDot 2s ease-out infinite',
        'shimmer':    'shimmer 1.8s linear infinite',
        'spin-slow':  'spin 46s linear infinite',
      },
      keyframes: {
        fadeIn:     { from: { opacity: '0', transform: 'translateY(4px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        slideIn:    { from: { opacity: '0', transform: 'translateX(-8px)' }, to: { opacity: '1', transform: 'translateX(0)' } },
        'aurora-drift': { from: { transform: 'translateX(-4%) rotate(0deg)' }, to: { transform: 'translateX(4%) rotate(3deg)' } },
        pulseDot:   { '0%': { boxShadow: '0 0 0 0 rgba(23,168,142,0.5)' }, '70%': { boxShadow: '0 0 0 6px rgba(23,168,142,0)' }, '100%': { boxShadow: '0 0 0 0 rgba(23,168,142,0)' } },
        shimmer:    { '0%': { backgroundPosition: '-1000px 0' }, '100%': { backgroundPosition: '1000px 0' } },
      },
    },
  },
  plugins: [],
}
export default config
