import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta beige/arena cálida — tono azahar suave
        olive: {
          50:  "#FDFAF5",
          100: "#F5EDE0",
          200: "#E8D5B8",
          300: "#D9BB90",
          400: "#C9A068",
          500: "#B8874A",
          600: "#9B7038",
          700: "#7D5B2A",  // principal: botones, nav activo
          800: "#634620",
          900: "#4D3418"
        },
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
        // Crema cálido — reemplaza blanco puro para encajar con el beige
        white: "#FAF6EE",
        gold: "#C9A068",
        rose: "#E61E4D",
        ink: "#222222",
        moss: "#9B7038",
        mossdark: "#7D5B2A",
        lantern: "#E61E4D",
        lanterndark: "#C2184A",
        hairline: "#E8D5B8",
        paper: "#FAF6EE",
        canvas: "#F2E8D8"
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
