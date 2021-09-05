const { guessProductionMode } = require("@ngneat/tailwind");
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
    prefix: '',
    purge: {
      enabled: guessProductionMode(),
      content: [
        './src/**/*.{html,ts}',
      ]
    },
    darkMode: 'class', // or 'media' or 'class'
    theme: {
      extend: {
        fontFamily: {
          sans: ['NexaLight', ...defaultTheme.fontFamily.sans],
          "nexa-bold": "NexaBold"
        },
        colors: {
          primary: "#cf8c45",
          "dark-grey": "#282929",
          "light-grey": "#474949",
          white: "#fefefe"
        },
        container: {
          center: true
        }
      },
    },
    variants: {
      extend: {},
    },
    plugins: [require('@tailwindcss/aspect-ratio'),require('@tailwindcss/forms'),require('@tailwindcss/line-clamp'),require('@tailwindcss/typography')],
};
