/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sua cor primária (vermelha)
        primary: {
          DEFAULT: "#1d223a", // Cor principal
          //   hover: "#", // Cor do hover
        },
        // Sua cor secundária (cinza)
        secondary: {
          DEFAULT: "#bebebe", // Cor principal
        },
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
