/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "375px",   // small phones
        sm: "425px",   // mobile breakpoint
        md: "768px",   // tablet
        lg: "1024px",  // laptop
        xl: "1440px",
        "2xl": "2560px",
      },
    },
  },
  plugins: [],
};
