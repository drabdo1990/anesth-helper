/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        clinical: {
          bg: '#090d16',
          card: '#131b2e',
          'card-hover': '#18223a',
          border: '#1e293b',
          'border-light': '#334155',
          cyan: '#06b6d4',
          'cyan-muted': '#0891b2',
          red: '#ef4444',
          emerald: '#10b981',
          amber: '#f59e0b',
          purple: '#a855f7',
        },
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.25)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'glow-emerald': '0 0 15px -3px rgba(16, 185, 129, 0.25)',
        'glow-amber': '0 0 15px -3px rgba(245, 158, 11, 0.25)',
      },
      minHeight: {
        touch: '48px',
      },
      minWidth: {
        touch: '48px',
      },
    },
  },
  plugins: [],
};
