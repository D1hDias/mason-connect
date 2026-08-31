#!/usr/bin/env node
/**
 * One-off PWA/iOS icon generator. Run manually (`npm run generate-icons -w
 * app`) whenever the source logo changes; the generated PNGs are committed
 * to `app/public/` like any other static asset — this script is not part of
 * `dev`/`build`.
 *
 * CAVEAT: `src/assets/logo-symbol.png` (323x323) is the only square asset
 * the visual identity currently provides. Every output below except the
 * 192x192 icon upscales it — acceptable for now but not ideal. Replace this
 * source with a >=512px version as soon as the identity kit ships one, and
 * re-run this script.
 *
 * `sharp` is intentionally NOT a project dependency (see app/package.json —
 * it's not in the brief's devDependencies list, since this script only ever
 * needs to run once per logo change). Install it ad hoc before running:
 *   npm install sharp --no-save -w app
 *   npm run generate-icons -w app
 * The next plain `npm install` prunes it back out as extraneous.
 */
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const source = path.resolve(dirname, '../src/assets/logo-symbol.png');
const outDir = path.resolve(dirname, '../public');

// Brand cream — matches manifest.background_color. Used as the maskable
// icon's flood fill so the safe-area padding reads as intentional, not blank.
const MASKABLE_BACKGROUND = '#F7F1E4';

async function plainIcon(size, filename) {
  await sharp(source)
    .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(path.join(outDir, filename));
  console.log(`generated ${filename} (${size}x${size})`);
}

async function maskableIcon(size, filename) {
  // Maskable icons get cropped into circles/squircles/etc. by the OS; content
  // must stay inside a centered "safe zone" (~80% of the canvas — see
  // https://www.w3.org/TR/appmanifest/#dfn-maskable-icons-safe-zone). Scaling
  // the logo to 60% of the canvas leaves a comfortable margin either side of
  // that boundary.
  const logoSize = Math.round(size * 0.6);
  const logo = await sharp(source).resize(logoSize, logoSize, { fit: 'contain' }).toBuffer();
  await sharp({
    create: { width: size, height: size, channels: 4, background: MASKABLE_BACKGROUND },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png()
    .toFile(path.join(outDir, filename));
  console.log(`generated ${filename} (${size}x${size}, maskable)`);
}

async function main() {
  await mkdir(outDir, { recursive: true });
  await plainIcon(192, 'pwa-192x192.png');
  await plainIcon(512, 'pwa-512x512.png');
  await maskableIcon(512, 'pwa-maskable-512x512.png');
  // iOS ignores the manifest's `icons` entirely for "Add to Home Screen" —
  // it only ever looks at the <link rel="apple-touch-icon"> in index.html.
  await plainIcon(180, 'apple-touch-icon.png');
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
