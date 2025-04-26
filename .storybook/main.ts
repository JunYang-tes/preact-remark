module.exports = {
  stories: ["../stories/**/*"],
  addons: [
    '@storybook/addon-essentials',
    "@storybook/addon-webpack5-compiler-babel",
    "@chromatic-com/storybook"
  ],

  framework: {
    name: "@storybook/preact-webpack5",
    options: {}
  },

  docs: {
    autodocs: true
  }
};
