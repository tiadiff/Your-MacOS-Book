/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Crimson Text"', 'serif'],
        sans: ['"Lato"', 'sans-serif'],
      },
      colors: {
        paper: '#fdfbf7',
        'paper-dark': '#f5f1e8',
        leather: '#5c3a21',
        'leather-light': '#8a5a38',
        ink: '#2d2d2d'
      },
      boxShadow: {
        'book': '0 20px 30px -10px rgba(0, 0, 0, 0.5)',
        'page-left': 'inset -15px 0 20px -10px rgba(0,0,0,0.1)',
        'page-right': 'inset 15px 0 20px -10px rgba(0,0,0,0.1)',
      }
    }
  },
  plugins: [],
}
