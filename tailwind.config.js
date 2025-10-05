/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // <-- This is the key change
    ],
    theme: {
      extend: {
        colors: {
            'primary-500': '#f97316',
            'primary-600': '#ea580c',
            'neutral-100': '#f5f5f5',
            'neutral-400': '#a3a3a3',
            'neutral-700': '#404040',
            'neutral-800': '#262626',
            'neutral-900': '#171717',
          },
          fontFamily: {
            'montserrat': ['Montserrat', 'sans-serif'],
            'poppins': ['Poppins', 'sans-serif'],
          }
      },
    },
    plugins: [],
  }