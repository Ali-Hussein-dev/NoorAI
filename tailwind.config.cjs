/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      typography: (/** @type {any} */ _theme) => ({
        DEFAULT: {
          css: {
            color: "",
            h1: {
              color: "",
            },
            h2: {
              color: "",
            },
            h3: {
              color: "",
            },
            h4: {
              color: "",
            },
            h5: {
              color: "",
            },
            h6: {
              color: "",
            },
            strong: {
              color: "",
            },
          },
        },
      }),
    },
  },
  plugins: [
    // @ts-expect-error types aren't available
    require("tailwind-custom-utilities"),
    require("@tailwindcss/typography"),
  ],
};

module.exports = config;
