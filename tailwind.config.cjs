/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    // @ts-expect-error types aren't available
    require("tailwind-custom-utilities"),
  ],
};

module.exports = config;
