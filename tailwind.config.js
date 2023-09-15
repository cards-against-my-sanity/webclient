/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      height: {
        '100': '25rem', // 400px
        '108': '27rem', // 432px
        '116': '29rem', // 464px
        '124': '31rem', // 496px
        '132': '33rem', // 528px
        '140': '35rem', // 560px
        '144': '36rem', // 576px
        '172': '43rem', // 688px
        '201': '50.5rem', // 804px
      },
      screens: {
        'mdht': { 'raw': '(min-height: 800px)' },
        'lght': { 'raw': '(min-height: 880px)' },
        'xlht': { 'raw': '(min-height: 920px)' },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}

