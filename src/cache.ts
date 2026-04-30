import * as cache from "@actions/cache";
import * as core from "@actions/core";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";

export const STATE_CACHE_ENABLED = "cache-enabled";
export const STATE_CACHE_KEY = "cache-key";
export const STATE_CACHE_MATCHED_KEY = "cache-matched-key";
export const STATE_CACHE_PATH = "cache-path";
const CACHE_VERSION = "v1";

export type CacheMode = "true" | "false" | "auto";

export function parseCacheMode(input: string): CacheMode {
  const normalized = input.trim().toLowerCase();
  if (
    normalized === "auto" ||
    normalized === "true" ||
    normalized === "false"
  ) {
    return normalized as CacheMode;
  }

  throw new Error(
    'Input `enable-cache` must be one of "true", "false", or "auto".',
  );
}

export function shouldEnableCache(mode: CacheMode): boolean {
  if (mode === "true") {
    return true;
  }

  if (mode === "false") {
    return false;
  }

  return process.env.RUNNER_ENVIRONMENT !== "self-hosted";
}

export function getCacheDir(): string {
  const configured = process.env.TOMBI_CACHE_HOME?.trim();
  if (configured) {
    return path.resolve(configured);
  }

  if (os.platform() === "win32") {
    const localAppData = process.env.LOCALAPPDATA?.trim();
    if (localAppData) {
      return path.join(localAppData, "tombi", "cache");
    }
  }

  if (os.platform() === "darwin") {
    return path.join(os.homedir(), "Library", "Caches", "tombi");
  }

  const xdgCacheHome = process.env.XDG_CACHE_HOME?.trim();
  if (xdgCacheHome) {
    return path.join(xdgCacheHome, "tombi");
  }

  return path.join(os.homedir(), ".cache", "tombi");
}

export async function restoreTombiCache(keyPart: string): Promise<void> {
  const cacheDir = getCacheDir();
  fs.mkdirSync(cacheDir, { recursive: true });
  core.exportVariable("TOMBI_CACHE_HOME", cacheDir);

  const cacheKey = createCacheKey(keyPart, cacheDir);
  core.saveState(STATE_CACHE_ENABLED, "true");
  core.saveState(STATE_CACHE_KEY, cacheKey);
  core.saveState(STATE_CACHE_PATH, cacheDir);

  let restoredKey: string | undefined;
  try {
    restoredKey = await cache.restoreCache([cacheDir], cacheKey, [
      `${createBaseCacheKey()}-`,
    ]);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to restore Tombi cache.";
    core.warning(message);
    core.setOutput("cache-hit", "false");
    return;
  }

  if (!restoredKey) {
    core.info(`No GitHub Actions cache found for key: ${cacheKey}`);
    core.setOutput("cache-hit", "false");
    return;
  }

  core.saveState(STATE_CACHE_MATCHED_KEY, restoredKey);
  core.info(`Restored Tombi cache from key: ${restoredKey}`);
  core.setOutput("cache-hit", "true");
}

export async function saveTombiCache(): Promise<void> {
  if (core.getState(STATE_CACHE_ENABLED) !== "true") {
    core.info("Tombi cache was not enabled. Skipping cache save.");
    return;
  }

  const cacheKey = core.getState(STATE_CACHE_KEY);
  const matchedKey = core.getState(STATE_CACHE_MATCHED_KEY);
  const cacheDir = core.getState(STATE_CACHE_PATH);
  if (!cacheKey || !cacheDir) {
    core.info("Cache state is incomplete. Skipping cache save.");
    return;
  }

  if (matchedKey === cacheKey) {
    core.info(`Cache hit for primary key ${cacheKey}. Skipping cache save.`);
    return;
  }

  if (!fs.existsSync(cacheDir)) {
    core.info(`Cache directory does not exist: ${cacheDir}`);
    return;
  }

  await cache.saveCache([cacheDir], cacheKey);
  core.info(`Saved Tombi cache to key: ${cacheKey}`);
}

function createCacheKey(keyPart: string, cacheDir: string): string {
  const normalizedPart = keyPart.trim() || "default";
  const normalizedPath = cacheDir.replace(/[\\/:\s]+/g, "-");
  return `${createBaseCacheKey()}-${normalizedPart}-${normalizedPath}`;
}

function createBaseCacheKey(): string {
  return ["setup-tombi", CACHE_VERSION, os.platform(), os.arch()].join("-");
}
