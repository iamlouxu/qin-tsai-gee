/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: {
          bg: "#FFF5F7",
          "bg-gradient-start": "#FCE7F3",
          "bg-gradient-end": "#FFF5F7",
          surface: "#FFFFFF",
          "surface-glass": "rgba(255, 255, 255, 0.92)",
          primary: "#FB7185",
          "primary-dark": "#F43F5E",
          "primary-deep": "#831843",
          "text-main": "#1E293B",
          "text-muted": "#64748B",
          "text-pink": "#9D174D",
          border: "rgba(244, 114, 182, 0.2)",
          expense: "#F43F5E",
          income: "#10B981",
          gold: "#F59E0B"
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Noto Sans TC', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        display: ['Outfit', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft-pink': '0 10px 30px -5px rgba(251, 113, 133, 0.12), 0 4px 12px -2px rgba(251, 113, 133, 0.06)',
        'card-hover': '0 16px 36px -6px rgba(251, 113, 133, 0.18)',
        'glow-pink': '0 8px 25px rgba(244, 63, 94, 0.4)',
        'fab': '0 10px 25px rgba(244, 63, 94, 0.45), 0 4px 10px rgba(251, 113, 133, 0.3)',
      },
    },
  },
  plugins: [],
}
