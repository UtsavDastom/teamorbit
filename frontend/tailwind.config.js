/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        orbit: {
          bg: '#0a0a0f',
          surface: '#111118',
          card: '#16161f',
          border: '#1e1e2e',
          muted: '#2a2a3d',
          text: '#e2e2f0',
          sub: '#8888aa',
          accent: '#7c6af7',
          accentHover: '#6856f0',
          green: '#22d3a0',
          red: '#f25a5a',
          yellow: '#f5c842',
          blue: '#4da6ff',
        },
      },
      backgroundImage: {
        'gradient-orbit': 'linear-gradient(135deg, #7c6af7 0%, #4da6ff 100%)',
      },
    },
  },
  plugins: [],
}
