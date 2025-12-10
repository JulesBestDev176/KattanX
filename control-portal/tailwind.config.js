/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#0b68da',
        'background-light': '#f5f7f8',
        'background-dark': '#101822',
        'dark-bic-blue': '#101822',
        'medium-blue': '#0b68da',
        'light-blue': '#e7edf4',
        'off-white': '#f5f7f8',
        'light-gray': '#cedae8',
        'accent-green': '#07883b',
        'accent-yellow': '#f59e0b',
        'accent-red': '#e73908',
        'surface-dark': '#182534',
        'border-dark': '#314a68',
        'text-muted-dark': '#90aacb',
        'status-green': '#28a745',
        'status-orange': '#ffc107',
        'status-gray': '#6c757d',
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
