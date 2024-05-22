/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  arrowParens: "avoid",
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: "none",
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
