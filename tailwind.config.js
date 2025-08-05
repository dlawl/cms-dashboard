// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#64748b',
        accent: '#38bdf8',
        background: '#f8fafc',
        'background-dark': '#1e293b',
        foreground: '#1e293b',
      },
      fontFamily: {
        sans: ['Inter', 'Noto Sans KR', 'sans-serif'],
      },
    },
  },
  plugins: [],
};