/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Theme colours are CSS variables (see globals.css) so the palette lives in one place.
        primary: 'rgb(var(--c-primary) / <alpha-value>)',       // main text (cream on dark)
        secondary: 'rgb(var(--c-secondary) / <alpha-value>)',   // supporting text
        background: 'rgb(var(--c-background) / <alpha-value>)', // page (charcoal)
        surface: 'rgb(var(--c-surface) / <alpha-value>)',       // cards / inputs
        muted: 'rgb(var(--c-muted) / <alpha-value>)',           // subtle fills
        cream: 'rgb(var(--c-cream) / <alpha-value>)',           // light feature cards
        ink: 'rgb(var(--c-ink) / <alpha-value>)',               // dark text on cream
        white: '#FFFFFF',
        // Third colour, set from the admin panel (see components/AccentColor.jsx)
        accent: 'rgb(var(--accent-rgb) / <alpha-value>)',
      },
    },
  },
  plugins: [],
}