import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#0f172a",
        panel: "#111827",
        brand: "#0ea5e9",
        muted: "#94a3b8"
      },
      boxShadow: {
        panel: "0 10px 25px -15px rgba(15, 23, 42, 0.55)"
      }
    }
  },
  plugins: []
};

export default config;
