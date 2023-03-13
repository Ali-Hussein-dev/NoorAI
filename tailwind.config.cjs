/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
    typography: (/** @type {any} */ _theme) => ({
      DEFAULT: {
        css: {
          color: undefined,
        },
      },
    }),
  },
  plugins: [
    // @ts-expect-error types aren't available
    require("tailwind-custom-utilities"),
    require("@tailwindcss/typography"),
  ],
};

module.exports = config;
