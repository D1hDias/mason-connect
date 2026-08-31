// Imported (not required): this file is loaded as ESM (package.json has
// "type": "module"), and Node's ESM loader has no `require`. Importing a
// CommonJS module from ESM works via Node's default-export interop.
import type { Config } from 'tailwindcss';
import preset from './tailwind-preset.cjs';

const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
  // finance-* utilities aren't used by any component in this package (they're
  // meant for free-form text in a *consuming* app, e.g. a ListRow trailing
  // amount) — Tailwind's content scan would otherwise never emit them, so
  // consumers (and the /design-sync bundle, which ships only what's already
  // compiled here) would reference a class with no matching CSS rule.
  safelist: ['text-finance-positive', 'text-finance-negative'],
};

export default config;
