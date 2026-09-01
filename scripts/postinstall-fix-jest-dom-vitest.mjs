#!/usr/bin/env node
// Works around a `vitest` version collision introduced by Task 10
// (`app` gained a real dependency on `better-auth`, which declares an
// OPTIONAL PEER dependency on `vitest@^4` — used only by its own
// `better-auth/vitest` test-helper export, which nothing in this repo
// imports).
//
// npm satisfies that optional peer by installing vitest@4.x at the repo
// ROOT node_modules — the shared slot every hoisted package resolves
// against. `app` and `design-system` (which need `vitest@^1.5`) and
// `server` (which needs `vitest@^3`) each get their OWN nested copy
// because root's slot doesn't satisfy them, so this doesn't affect the
// actual test *runners*.
//
// It DOES break `@testing-library/jest-dom`, though: `jest-dom` itself has
// no conflicting version anywhere in the tree, so npm hoists it straight to
// the root. Its `@testing-library/jest-dom/vitest` entry point does
// `import { expect } from 'vitest'` — resolved, like any bare import,
// relative to jest-dom's OWN install location (root), not to whichever
// workspace imports it. That import lands on the mismatched root vitest@4,
// whose `expect` state shape differs from vitest@1's (e.g. `testPath` is a
// getter-only accessor in v4 vs. a plain assignable field in v1). Since
// `expect`'s global state lives on a shared `globalThis` symbol, `app`'s
// actual vitest@1.6.1 test run later tries to plain-assign that same
// getter-only property and crashes every single test with
// `TypeError: Cannot set property testPath of #<Object> which has only a
// getter` (also breaks `tsc`'s resolution of jest-dom's `Assertion` type
// augmentation, which needs the same 'vitest' import to type-check).
//
// Fix: after every `npm install`, if root's hoisted `vitest` doesn't match
// `app`'s local one (missing entirely, or a different version — including
// the optional-peer collision above), replace the root copy with a symlink
// to `app/node_modules/vitest`. This is the version `@testing-library/
// jest-dom` (an `app`-only dependency) needs to interoperate with anyway.
// Idempotent — a no-op once root already resolves to the same version
// (e.g. if a future npm release stops auto-installing optional peers this
// way, or better-auth drops the peer).
import { existsSync, readFileSync, rmSync, symlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const rootNodeModules = join(repoRoot, "node_modules");
const vitestAtRoot = join(rootNodeModules, "vitest");
const vitestInApp = join(repoRoot, "app", "node_modules", "vitest");
const vitestBinAtRoot = join(rootNodeModules, ".bin", "vitest");

function readVersion(pkgDir) {
  try {
    return JSON.parse(readFileSync(join(pkgDir, "package.json"), "utf8")).version;
  } catch {
    return null;
  }
}

function main() {
  if (!existsSync(vitestInApp)) {
    // app hasn't installed its own vitest yet — nothing to reconcile against.
    return;
  }

  const appVersion = readVersion(vitestInApp);
  const rootVersion = existsSync(vitestAtRoot) ? readVersion(vitestAtRoot) : null;

  if (rootVersion !== null && rootVersion === appVersion) {
    // Already resolving to the same version — nothing to do.
    return;
  }

  // `rmSync` (not `unlinkSync`) because npm may have installed a REAL
  // directory here (the mismatched vitest@4 package, not a symlink) —
  // `unlinkSync` throws EISDIR on a real directory and would silently no-op
  // under the try/catch this used to have, leaving the stale install in
  // place and making the `symlinkSync` below fail with EEXIST.
  for (const target of [vitestAtRoot, vitestBinAtRoot]) {
    rmSync(target, { recursive: true, force: true });
  }

  symlinkSync(join("..", "app", "node_modules", "vitest"), vitestAtRoot, "dir");
  symlinkSync(join("..", "vitest", "vitest.mjs"), vitestBinAtRoot);
  console.log(
    `[postinstall-fix-jest-dom-vitest] Linked node_modules/vitest -> app/node_modules/vitest (was ${rootVersion ?? "missing"}, now ${appVersion}).`,
  );
}

main();
