#!/usr/bin/env node
// Works around a known drizzle-kit + npm-workspaces hoisting quirk.
//
// drizzle-kit's CLI (bin.cjs) dynamically `import("drizzle-orm/version")` to
// check compatibility, resolved relative to drizzle-kit's OWN installed
// location — not the workspace that invokes it. In this monorepo, npm
// hoists `drizzle-kit` to the repo root's node_modules, but keeps
// `drizzle-orm` nested inside `server/node_modules` (npm's resolver nests it
// there because of a peer-dependency override between `better-auth`,
// `@better-auth/drizzle-adapter`, and `drizzle-kit`). Since the two end up
// in different node_modules directories, drizzle-kit's dynamic import fails
// to resolve `drizzle-orm` at all, and it exits with the misleading message
// "Please install latest version of drizzle-orm" even though a compatible
// version is installed.
//
// Fix: after every `npm install`, ensure a `drizzle-orm` entry exists next
// to wherever `drizzle-kit` actually landed, pointing at the real install.
// This is idempotent and a no-op once both already resolve correctly (e.g.
// if a future npm/drizzle-kit release fixes the resolution itself).
import { existsSync, lstatSync, symlinkSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const rootNodeModules = join(repoRoot, "node_modules");
const drizzleKitAtRoot = join(rootNodeModules, "drizzle-kit");
const drizzleOrmAtRoot = join(rootNodeModules, "drizzle-orm");
const drizzleOrmInServer = join(repoRoot, "server", "node_modules", "drizzle-orm");

function main() {
  if (!existsSync(drizzleKitAtRoot)) {
    // drizzle-kit isn't hoisted to root in this install — nothing to fix.
    return;
  }
  if (existsSync(drizzleOrmAtRoot)) {
    // Already resolvable from root — nothing to do.
    return;
  }
  if (!existsSync(drizzleOrmInServer)) {
    console.warn(
      "[postinstall-fix-drizzle] drizzle-orm not found in server/node_modules either — skipping (run `npm install -w server` first).",
    );
    return;
  }

  try {
    if (lstatSync(drizzleOrmAtRoot, { throwIfNoEntry: false })) {
      unlinkSync(drizzleOrmAtRoot);
    }
  } catch {
    // ignore
  }

  symlinkSync(join("..", "server", "node_modules", "drizzle-orm"), drizzleOrmAtRoot, "dir");
  console.log("[postinstall-fix-drizzle] Linked node_modules/drizzle-orm -> server/node_modules/drizzle-orm");
}

main();
