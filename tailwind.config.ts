import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm cream paper background — the base for the whole site
        cream: {
          50: '#FAF7F2',
          100: '#F5F2EE',
          200: '#EDE7DD',
          300: '#E2D9C8',
        },
        kraft: {
          100: '#E8D9B8',
          200: '#D9C49A',
          300: '#C8AE7D',
          400: '#B8995F',
        },
        ink: {
          900: '#1A1814',
          800: '#2A2620',
          700: '#3D3830',
        },
        accent: {
          yellow: '#FFE066',
          coral: '#FF8C7A',
          mint: '#B8E6C9',
          lilac: '#D6C9F0',
          sky: '#BDE0F0',
        },
      },
      fontFamily: {
        // Wired up in app/layout.tsx via next/font/google
        script: ['var(--font-script)', 'cursive'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        sticky: '4px 6px 0 rgba(0,0,0,0.08), 0 12px 24px -8px rgba(0,0,0,0.18)',
        card: '0 1px 0 rgba(0,0,0,0.06), 0 10px 30px -12px rgba(0,0,0,0.25)',
        window: '0 20px 60px -20px rgba(0,0,0,0.35), 0 2px 0 rgba(0,0,0,0.06)',
      },
      backgroundImage: {
        // CSS dot-grid — used on the page background for graph-paper feel
        'dot-grid':
          'radial-gradient(circle, rgba(26,24,20,0.18) 1px, transparent 1.2px)',
      },
      keyframes: {
        blink: {
          '0%, 50%': { opacity: '1' },
          '50.01%, 100%': { opacity: '0' },
        },
      },
      animation: {
        blink: 'blink 1s steps(2) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
