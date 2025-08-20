import {heroui} from "@heroui/react";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        dark: {
          extend: "dark",
          colors: {
            background: "#121212",
            foreground: "#ffffff",
            primary: {
              50: "#E3F2FD",
              100: "#BBDEFB",
              200: "#90CAF9",
              300: "#64B5F6",
              400: "#42A5F5",
              500: "#2196F3",
              600: "#1E88E5",
              700: "#1976D2",
              800: "#1565C0",
              900: "#0D47A1",
              DEFAULT: "#2196F3",
              foreground: "#ffffff"
            },
            // ... other color definitions
          }
        }
      }
    })
  ]
};
