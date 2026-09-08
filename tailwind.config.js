/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        institution: {
          50: '#eef4fb',
          100: '#d4e3f6',
          200: '#a8c7ed',
          300: '#6da4df',
          400: '#3d7fc9',
          500: '#1e5fae',
          600: '#0f4a93',
          700: '#0a3a76',
          800: '#082f5f',
          900: '#062547',
          950: '#041a33',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};
