// `.cjs` extension: see the note on tailwind-preset.cjs above — package.json's
// "type": "module" would otherwise make `module.exports` throw here too, and
// Storybook's Vite pipeline loads this file directly.
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
