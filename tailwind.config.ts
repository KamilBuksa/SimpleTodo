import type { Config } from "tailwindcss";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – no types for this plugin
import animatePlugin from "tw-animate-css";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,astro}"],
  theme: {
    extend: {
      keyframes: {
        "fade-slide-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-slide-down": {
          "0%": { opacity: "0", transform: "translateY(-8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "bounce-gentle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-2px)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(59, 130, 246, 0.4)" },
          "50%": { boxShadow: "0 0 0 8px rgba(59, 130, 246, 0)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-1deg)" },
          "75%": { transform: "rotate(1deg)" },
        },
        "slide-in-right": {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        "slide-out-right": {
          "0%": { opacity: "1", transform: "translateX(0)" },
          "100%": { opacity: "0", transform: "translateX(20px)" },
        },
      },
      animation: {
        "fade-slide-up": "fade-slide-up 0.25s ease-out",
        "fade-slide-down": "fade-slide-down 0.25s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
        "bounce-gentle": "bounce-gentle 0.6s ease-in-out",
        "pulse-glow": "pulse-glow 2s infinite",
        wiggle: "wiggle 0.5s ease-in-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        "slide-out-right": "slide-out-right 0.3s ease-in",
      },
    },
  },
  plugins: [animatePlugin],
};

export default config;
