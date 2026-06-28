import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1C2B33",
        canvas: "#FAF7F0",
        moss: "#4F6F52",
        mossdark: "#3A5240",
        gold: "#D9A441",
        lantern: "#E2622B",
        lanterndark: "#C44F1D",
        hairline: "#E4DDCB",
        paper: "#FFFDF8"
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "monospace"]
      },
      borderRadius: {
        ticket: "10px"
      }
    }
  },
  plugins: []
};

export default config;
