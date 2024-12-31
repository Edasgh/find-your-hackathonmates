/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "#1B1B1D",
        bgSecondary: "#242526",
        textPrimary: "#E3E3E3",
        textSecondary: "#B98EFD",
        textBgPrimary: "#444950",
        textBgPrimaryHv: "#BA8FFF",
        footerBg: "#303846",
      },
    },
  },
  plugins: [],
};
