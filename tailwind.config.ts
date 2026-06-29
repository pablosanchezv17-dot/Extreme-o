import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta verde oliva moderna
        olive: {
          50:  "#f6f7f0",
          100: "#e9edd8",
          200: "#d4dbb3",
          300: "#b8c484",
          400: "#9aab58",
          500: "#7d9038",
          600: "#5c6e27",
          700: "#475520",
          800: "#394419",
          900: "#2d3614"
        },
        // Grises neutros (estilo Airbnb)
        neutral: {
          50:  "#f7f7f7",
          100: "#ebebeb",
          200: "#dddddd",
          300: "#c2c2c2",
          400: "#a0a0a0",
          500: "#717171",
          600: "#545454",
          700: "#383838",
          800: "#222222",
          900: "#111111"
        },
        // Acentos
        gold: "#E8A838",
        rose: "#E61E4D",
        // Compat con código anterior
        ink: "#222222",
        moss: "#5c6e27",
        mossdark: "#475520",
        lantern: "#E61E4D",
        lanterndark: "#C2184A",
        hairline: "#dddddd",
        paper: "#ffffff",
        canvas: "#f7f7f7"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      },
      borderRadius: {
        ticket: "12px",
        xl: "12px",
        "2xl": "16px",
        "3xl": "24px"
      },
      boxShadow: {
        card: "0 2px 16px rgba(0,0,0,0.08)",
        "card-hover": "0 4px 32px rgba(0,0,0,0.14)",
        nav: "0 1px 0 rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

export default config;
