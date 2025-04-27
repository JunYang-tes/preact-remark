module.exports = {
  stories: ["../stories/**/*"],
  addons: [
    '@storybook/addon-essentials',
    "@chromatic-com/storybook"
  ],

  framework: {
    name: "@storybook/preact-vite",
    options: {}
  },

  docs: {
    autodocs: true
  }
};
