import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        stellar: {
          primary: "#FF7B00",
          hover: "#E06D00",
          glow: "#FFA84D",
          dark: "#0F1117",
          card: "#161922",
          border: "#252B3B",
          accent: "#2A3042",
        },
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(255, 123, 0, 0.2)" },
          "100%": { boxShadow: "0 0 30px rgba(255, 123, 0, 0.6)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
