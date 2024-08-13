/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'custom-shadow': '0 4px 6px -1px rgba(207, 212, 223, 0.5)', // Adjust the RGBA values to your preferred color
      },
    },
  },
  plugins: [],
}