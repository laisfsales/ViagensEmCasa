import type { Config } from "tailwindcss";
const { addDynamicIconSelectors } = require('@iconify/tailwind');
const { addIconSelectors } = require('@iconify/tailwind');

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('daisyui'),
    addIconSelectors(['mdi', 'mdi-light']),
    addDynamicIconSelectors(),
  ],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark", 
    base: true, 
    styled: true,
    utils: true, 
    prefix: "", 
    logs: false, 
    themeRoot: ":root", 
  },
};
export default config;

