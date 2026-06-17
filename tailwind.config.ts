import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#002147",
          400: "#2e5478",
          300: "#deeeff",
        },
        accent: {
          500: "#00bbea",
          400: "#00c6ef",
          300: "#8eebff",
          200: "#c1f4ff",
        },
        lime: {
          500: "#cbff00",
          200: "#e0ff80",
          100: "#eeffb3",
          50:  "#f9ffe0",
        },
        base: {
          bg:   "#f7fbff",
          text: "#07182d",
        },
      },
      fontFamily: {
        sans:    ["Nunito Sans", "system-ui", "sans-serif"],
        nunito:  ["Nunito Sans", "system-ui", "sans-serif"],
        paytone: ["Paytone One", "Arial Black", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
