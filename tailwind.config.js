/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#137a3c',
        secondary: '#6b7280',
        background: '#f7f7f7',
        dark: '#1a1a1a',
        'noise-gray': '#2a2a2a',
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'elms': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        'montserrat-alt': ['Inter', 'system-ui', 'sans-serif'],
        'montserrat': ['Inter', 'system-ui', 'sans-serif'],
        'sf-pro': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        'mono': ['JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', 'Courier New', 'monospace'],
      },
      borderRadius: {
        'card': '12px',
        'button': '9999px',
      },
    },
  },
  plugins: [],
}
