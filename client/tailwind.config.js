/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  safelist: [
    'bg-blue-50',
    'dark:bg-blue-900/30',
    'bg-green-50',
    'dark:bg-green-900/30',
    'bg-yellow-50',
    'dark:bg-yellow-900/30',
    'bg-red-50',
    'dark:bg-red-900/30',
    'bg-purple-50',
    'dark:bg-purple-900/30',
  ],
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
        muted: '#EAEAEA',
      },
    },
  },
  plugins: [],
}