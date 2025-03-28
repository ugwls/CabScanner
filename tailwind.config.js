/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#007AFF',
        secondary: '#FF3B30',
        background: '#F2F2F7',
      },
    },
  },
  plugins: [],
};