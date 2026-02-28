import { describe, it } from "vitest";
import { expectResolvedVersion, expectVersionNotFound } from "./helpers";

describe("pnpm-lock.yaml parser", () => {
  it("resolves version from packages key entry", () => {
    expectResolvedVersion(
      "pnpm-lock.yaml",
      `
packages:
  tombi@0.9.3:
    resolution: {integrity: sha512-abc}
`,
      "0.9.3",
    );
  });

  it("resolves version from alias package entry", () => {
    expectResolvedVersion(
      "pnpm-lock.yaml",
      `
packages:
  '@tombi-toml/tombi@0.9.4':
    resolution: {integrity: sha512-abc}
`,
      "0.9.4",
    );
  });

  it("resolves version from importer dependency metadata", () => {
    expectResolvedVersion(
      "pnpm-lock.yaml",
      `
importers:
  .:
    dependencies:
      tombi:
        version: 0.9.5
        specifier: ^0.9.0
`,
      "0.9.5",
    );
  });

  it("returns undefined when package is missing", () => {
    expectVersionNotFound(
      "pnpm-lock.yaml",
      `
packages:
  foo@1.0.0:
    resolution: {integrity: sha512-abc}
`,
    );
  });
});
