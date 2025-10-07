/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#222222',    // Your Primary color
        secondary: '#7B7B7B',  // Your Secondary color
        background: '#F8F8F8', // Your Tertiary/Background color
        white: '#FFFFFF',       // Your White color
      },
    },
  },
  plugins: [],
}