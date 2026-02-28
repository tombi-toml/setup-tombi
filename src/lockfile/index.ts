import * as fs from "node:fs";
import * as path from "node:path";
import { extractVersionFromUvLock } from "./uv-lock";
import { extractVersionFromPoetryLock } from "./poetry-lock";
import { extractVersionFromPnpmLock } from "./pnpm-lock";
import { extractVersionFromPackageLock } from "./package-lock";
import { extractVersionFromYarnLock } from "./yarn-lock";
import { extractVersionFromBunLock } from "./bun-lock";

export const PYTHON_PACKAGE_ALIASES = ["tombi"] as const;
export const TYPESCRIPT_PACKAGE_ALIASES = [
  "tombi",
  "@tombi-toml/tombi",
] as const;

export const PYTHON_LOCKFILE_KINDS = ["uv.lock", "poetry.lock"] as const;
export const TYPESCRIPT_LOCKFILE_KINDS = [
  "pnpm-lock.yaml",
  "package-lock.json",
  "yarn.lock",
  "bun.lock",
] as const;
export const SUPPORTED_LOCKFILES = [
  ...PYTHON_LOCKFILE_KINDS,
  ...TYPESCRIPT_LOCKFILE_KINDS,
] as const;

export type LockfileKind = (typeof SUPPORTED_LOCKFILES)[number];

const LOCKFILE_PACKAGE_ALIASES: Record<LockfileKind, readonly string[]> = {
  "uv.lock": PYTHON_PACKAGE_ALIASES,
  "poetry.lock": PYTHON_PACKAGE_ALIASES,
  "pnpm-lock.yaml": TYPESCRIPT_PACKAGE_ALIASES,
  "package-lock.json": TYPESCRIPT_PACKAGE_ALIASES,
  "yarn.lock": TYPESCRIPT_PACKAGE_ALIASES,
  "bun.lock": TYPESCRIPT_PACKAGE_ALIASES,
};

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

export function getIndent(line: string): number {
  return line.match(/^\s*/)?.[0].length ?? 0;
}

export function isTargetPackage(
  name: string,
  packageAliases: readonly string[],
): boolean {
  return packageAliases.some((alias) => alias === name);
}

export function cleanResolvedVersion(version: string): string {
  const withoutQuotes = version.trim().replace(/^["']|["']$/g, "");
  const withoutDelimiter = withoutQuotes.replace(/[,:]$/, "");
  const withoutPeerSuffix = withoutDelimiter.split("(")[0].trim();
  if (withoutPeerSuffix.startsWith("npm:")) {
    return withoutPeerSuffix.slice(4);
  }
  return withoutPeerSuffix;
}

export function detectLockfileKind(lockfilePath: string): LockfileKind {
  const lockfileName = path.basename(lockfilePath);
  if (SUPPORTED_LOCKFILES.includes(lockfileName as LockfileKind)) {
    return lockfileName as LockfileKind;
  }
  throw new Error(
    `Unsupported lock file: ${lockfilePath}. Supported: ${SUPPORTED_LOCKFILES.join(
      ", ",
    )}`,
  );
}

export function packageNotFoundError(
  lockfileInput: string,
  lockfileKind: LockfileKind,
): Error {
  const packageAliases = LOCKFILE_PACKAGE_ALIASES[lockfileKind];
  return new Error(
    `Package ${packageAliases
      .map((name) => `\`${name}\``)
      .join(" or ")} was not found in lock file: ${lockfileInput}`,
  );
}

export function extractVersionByKind(
  lockfileKind: LockfileKind,
  content: string,
): string | undefined {
  switch (lockfileKind) {
    case "uv.lock":
      return extractVersionFromUvLock(content);
    case "poetry.lock":
      return extractVersionFromPoetryLock(content);
    case "pnpm-lock.yaml":
      return extractVersionFromPnpmLock(content);
    case "package-lock.json":
      return extractVersionFromPackageLock(content);
    case "yarn.lock":
      return extractVersionFromYarnLock(content);
    case "bun.lock":
      return extractVersionFromBunLock(content);
  }
}

export async function resolveVersionFromLockfile(
  lockfileInput: string,
): Promise<string> {
  const lockfilePath = path.resolve(lockfileInput);
  const lockfileKind = detectLockfileKind(lockfilePath);
  const lockfileBuffer = await fs.promises.readFile(lockfilePath);
  const lockfileContent = lockfileBuffer.toString("utf8");
  const resolvedVersion = extractVersionByKind(lockfileKind, lockfileContent);
  if (!resolvedVersion) {
    throw packageNotFoundError(lockfileInput, lockfileKind);
  }

  return resolvedVersion;
}
