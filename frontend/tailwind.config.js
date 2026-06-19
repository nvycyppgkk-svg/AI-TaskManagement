/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#1a1a2e',
          blue: '#4f6ef7',
          hover: '#3a58e0',
        },
      },
    },
  },
  plugins: [],
}
