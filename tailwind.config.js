/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        mb: {
          brand: '#509EE3',
          'brand-dark': '#1871BF',
          'brand-darker': '#105490',
          'blue-5': '#F8FBFE',
          'blue-10': '#EEF6FD',
          'blue-20': '#CBE2F7',
          'blue-30': '#8DC0ED',
          'text-dark': '#4C5773',
          'text-medium': '#696E7B',
          'text-light': '#949AAB',
          'bg-light': '#F9FBFC',
          'bg-medium': '#EDF2F5',
          'bg-black': '#2E353B',
          border: '#EEECEC',
        },
      },
      letterSpacing: {
        'filter-label': '0.35px',
        'table-header': '0.8px',
      },
    },
  },
  plugins: [],
};
