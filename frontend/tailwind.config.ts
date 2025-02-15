import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#232323",
        white: "#FFFFFF",
        purple: "#896CFE",
        "light-purple": "#B3A0FF",
        lime: "#E2F163",
      },
    },
  },
  plugins: [],
} satisfies Config;
