import { expect } from "vitest";
import type { LockfileKind } from "../../src/lockfile";
import { extractVersionByKind } from "../../src/lockfile";

export function expectResolvedVersion(
  kind: LockfileKind,
  content: string,
  expectedVersion: string,
): void {
  expect(extractVersionByKind(kind, content)).toBe(expectedVersion);
}

export function expectVersionNotFound(
  kind: LockfileKind,
  content: string,
): void {
  expect(extractVersionByKind(kind, content)).toBeUndefined();
}
