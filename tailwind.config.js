/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      // scan all of your pages / components in the App Router:
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      // if you also have a `pages/` folder or `components/`:
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {}
    },
    plugins: []
  };
  