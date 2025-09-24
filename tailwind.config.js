// tailwind.config.js
const { heroui } = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(button|user|ripple|spinner|avatar).js",
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['var(--font-oswald)'],
        body: ['var(--font-roboto)'],
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        "canopy-x": {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        "canopy-y": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(-100%)" },
        },
      },
      animation: {
        "canopy-horizontal": "canopy-x var(--duration) linear infinite",
        "canopy-vertical": "canopy-y var(--duration) linear infinite",
         'infinite-scroll': 'infinite-scroll 40s linear infinite',
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};














