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
          cream: '#FAF7F2',
          ivory: '#F4EFE6',
          beige: '#E8DFD3',
          sand: '#D9CBBA',
          bronze: '#A68A68',
          mocha: '#6B4E3D',
          espresso: '#38251C',
          gold: '#C5A059',
          goldLight: '#E8D5A5',
          goldDark: '#997635',
        }
      },
      fontFamily: {
        arabic: ['Amiri', 'Traditional Arabic', 'serif'],
        kufi: ['Reem Kufi', 'Cairo', 'sans-serif'],
        serif: ['Cormorant Garamond', 'Playfair Display', 'serif'],
      },
      boxShadow: {
        'luxury': '0 20px 45px -10px rgba(56, 37, 28, 0.14), 0 8px 20px rgba(197, 160, 89, 0.1)',
        'luxury-glow': '0 0 35px rgba(197, 160, 89, 0.25)',
      }
    },
  },
  plugins: [],
}
