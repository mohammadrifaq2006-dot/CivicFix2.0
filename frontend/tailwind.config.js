/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#050811',
          secondary: '#080E1B',
          card: '#0C1427',
          cardHover: '#111B34',
          border: 'rgba(255, 255, 255, 0.08)',
        },
        slateSurface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          800: '#162032',
          900: '#0C1427',
          950: '#050811',
        },
        civicEmerald: {
          400: '#00FF88',
          500: '#10B981',
          600: '#059669',
        },
        civicCyan: {
          400: '#00E5FF',
          500: '#06B6D4',
          600: '#0284C7',
        },
        civicAmber: {
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-green': '0 0 25px -4px rgba(0, 255, 136, 0.25)',
        'glow-cyan': '0 0 25px -4px rgba(0, 229, 255, 0.25)',
        'glow-card': '0 10px 40px -10px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}
