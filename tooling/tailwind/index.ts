import type { Config } from "tailwindcss";
//
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  darkMode: "class",
  content: ["./**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      colors: {
        title: "#313135",
        sky: {
          500: "#0090FF",
        },
        // Dark Mode
        stone: {
          // All these should have a hue of 240 (or close)
          200: "#e4e4e7",
          300: "#93939a",
          400: "#72727e",
          450: "#52525b",
          500: "#6d6d78",
        },
        // Light Mode
        neutral: {
          // All these should have a hue of 210 (or close)
          100: "#f4f4f5",
          200: "#e4e6e7",
          300: "#d1d4d6",
          350: "#919197",
          400: "#9c9ca5",
          450: "#9999a3",
          500: "#878792",
          600: "#4e5256",
          700: "#404245",
          800: "#242628",
          900: "#161718",
        },
      },
    },
    theme: {
      extend: {
        fontFamily: {
          sans: ["var(--font-inter)", ...fontFamily.sans],
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/typography"),
    require("tailwindcss-radix"),
    require("tailwindcss-animate"),
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unsafe-call
    require("tailwind-scrollbar")({ nocompatible: true }),
    require("@tailwindcss/forms"),
  ],
} satisfies Config;
