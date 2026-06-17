/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#111417',   // тёмный хедер
          amber: '#f0ad3c',  // акцент (кнопки)
          blue: '#3b82f6',
        },
      },
    },
  },
  plugins: [],
}
