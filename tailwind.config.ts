import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0B0B0A",
        foreground: "#FFFFFF",
        accent: "#C9A96A",
        muted: "#F7F6F3",
        border: "#E8E5DF",
        text: "#121212",
        textSecondary: "#666666",
        stateGreen: "#2A3527",
      },
      borderRadius: {
        DEFAULT: "8px",
      },
    },
  },
  plugins: [],
};

export default config;
