// Imported (not required): this file is loaded as ESM (package.json has
// "type": "module"), and Node's ESM loader has no `require`. Importing a
// CommonJS module from ESM works via Node's default-export interop.
import type { Config } from 'tailwindcss';
import preset from './tailwind-preset.cjs';

const config: Config = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
};

export default config;
