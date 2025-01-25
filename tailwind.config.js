/** @type {import('tailwindcss').Config} */

const config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4ED8',
        secondary: '#9333EA',
        navy: '#1A2A3A',
        navyLight: '#2A3A4A',
        cream: '#F5F2EA',
        gold: '#C3A343',
        goldDark: '#B39333',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        source: ['Source Serif 4', 'serif'],
        source3: ['Source Sans 3', 'serif'],
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};

export default config;
