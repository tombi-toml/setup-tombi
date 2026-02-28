import { describe, expect, it } from "vitest";
import { detectLockfileKind } from "../../src/lockfile";

describe("lockfile index helpers", () => {
  it("detects supported lockfile kinds by basename", () => {
    expect(detectLockfileKind("/tmp/uv.lock")).toBe("uv.lock");
    expect(detectLockfileKind("/tmp/poetry.lock")).toBe("poetry.lock");
    expect(detectLockfileKind("/tmp/pnpm-lock.yaml")).toBe("pnpm-lock.yaml");
    expect(detectLockfileKind("/tmp/package-lock.json")).toBe(
      "package-lock.json",
    );
    expect(detectLockfileKind("/tmp/yarn.lock")).toBe("yarn.lock");
    expect(detectLockfileKind("/tmp/bun.lock")).toBe("bun.lock");
  });

  it("throws for unsupported lockfile", () => {
    expect(() => detectLockfileKind("/tmp/unknown.lock")).toThrow(
      /Unsupported lock file/,
    );
  });
});
