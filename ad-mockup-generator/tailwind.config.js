/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          400: '#2dd4bf',
          500: '#14b8a6',
        },
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        purple: {
          400: '#c084fc',
          500: '#a855f7',
        },
      },
      animation: {
        'gradient': 'gradient 3s ease infinite',
        'slide-up': 'slide-up 0.5s ease-out',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-down': 'slide-down 0.5s ease-out',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(10px)',
      },
    },
  },
  plugins: [],
}