#!/usr/bin/env bun
/**
 * Syncs the version in jsr.json from package.json.
 *
 * package.json is the single source of truth for the package version. This script
 * is run by the `version` lifecycle script on local bumps and again in CI before
 * publishing to JSR, so the two registries can never diverge.
 */

import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const packageJsonPath = join(repoRoot, "package.json");
const jsrJsonPath = join(repoRoot, "jsr.json");

const packageJson = await Bun.file(packageJsonPath).json();
const jsrJson = await Bun.file(jsrJsonPath).json();

const version: unknown = packageJson.version;
if (typeof version !== "string" || version.length === 0) {
  console.error('[sync:jsr] package.json has no usable "version" field');
  process.exit(1);
}

if (jsrJson.version === version) {
  console.log(`[sync:jsr] jsr.json already at ${version} — nothing to do`);
  process.exit(0);
}

const previous = jsrJson.version;
jsrJson.version = version;
await Bun.write(jsrJsonPath, `${JSON.stringify(jsrJson, null, 2)}\n`);

console.log(`[sync:jsr] jsr.json version ${previous} -> ${version}`);
