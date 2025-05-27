import type { Config } from 'tailwindcss'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore – no types for this plugin
import animatePlugin from 'tw-animate-css'

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx,astro}'],
  theme: {
    extend: {
      keyframes: {
        'fade-slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-slide-up': 'fade-slide-up 0.25s ease-out',
      },
    },
  },
  plugins: [animatePlugin],
}

export default config 