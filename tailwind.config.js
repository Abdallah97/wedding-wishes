/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          ivory: '#FCF9F5',
          cream: '#F7F2EB',
          linen: '#F1E9DF',
          beige: '#E6DCCE',
          sand: '#D4C4B3',
          bronze: '#9A7B66',
          warmTaupe: '#7D6151',
          mocha: '#533B2E',
          espresso: '#2B1A12',
          gold: '#C59E50',
          goldLight: '#EADBB6',
          goldDark: '#99732B',
          rose: '#B85D6A',
          roseLight: '#F7ECEE',
          roseHover: '#A44F5C',
        }
      },
      fontFamily: {
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
        kufi: ['Reem Kufi', 'Cairo', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 45px -12px rgba(43, 26, 18, 0.12), 0 6px 18px rgba(197, 158, 80, 0.08)',
        'luxury-hover': '0 24px 50px -10px rgba(43, 26, 18, 0.18), 0 10px 24px rgba(197, 158, 80, 0.15)',
        'luxury-glow': '0 0 35px rgba(197, 158, 80, 0.22)',
      }
    },
  },
  plugins: [],
}
