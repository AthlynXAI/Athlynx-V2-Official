import type { Config } from "tailwindcss";

// AthlynX Brand Lock — cobalt / granite / electric-blue only.
// NO yellow / amber / gold / orange anywhere.
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cobalt: {
          50: "#eef4ff",
          100: "#d9e6ff",
          500: "#0a3fbf",
          600: "#0833a3",
          700: "#062788",
          900: "#031152",
        },
        granite: {
          50: "#f6f7f9",
          100: "#e9ecf1",
          500: "#5b6473",
          700: "#2f3640",
          900: "#13161c",
        },
        electric: {
          400: "#3b82f6",
          500: "#1d6fff",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
