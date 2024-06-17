/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js" // 1. add this line
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('flowbite/plugin') // 2. add this line
  ],
}
