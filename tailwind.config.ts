
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3B6D11',   
        cta: '#C8742A',       
        background: '#F5F9F0',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'], // match headings style from the customer site
      },
    },
  },
  plugins: [],
} satisfies Config;