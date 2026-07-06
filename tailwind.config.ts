import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Paleta ámbar/naranja azahar (extraída del logo)
        olive: {
          50:  "#FFF8ED",
          100: "#FEF0D0",
          200: "#FCD99A",
          300: "#F9C063",
          400: "#F5A432",
          500: "#D7842C",
          600: "#B86D1F",
          700: "#965616",
          800: "#7A430F",
          900: "#62340A"
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
        gold: "#D7842C",
        rose: "#E61E4D",
        ink: "#222222",
        moss: "#B86D1F",
        mossdark: "#965616",
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
