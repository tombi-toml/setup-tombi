import { describe, it } from "vitest";
import { expectResolvedVersion, expectVersionNotFound } from "./helpers";

describe("package-lock.json parser", () => {
  it("resolves version from lockfileVersion 3 packages map", () => {
    expectResolvedVersion(
      "package-lock.json",
      JSON.stringify({
        lockfileVersion: 3,
        packages: {
          "node_modules/tombi": { version: "0.9.6" },
        },
      }),
      "0.9.6",
    );
  });

  it("resolves alias package from packages map", () => {
    expectResolvedVersion(
      "package-lock.json",
      JSON.stringify({
        lockfileVersion: 3,
        packages: {
          "node_modules/@tombi-toml/tombi": { version: "0.9.7" },
        },
      }),
      "0.9.7",
    );
  });

  it("resolves version from lockfileVersion 1 dependencies map", () => {
    expectResolvedVersion(
      "package-lock.json",
      JSON.stringify({
        lockfileVersion: 1,
        dependencies: {
          tombi: { version: "0.9.8" },
        },
      }),
      "0.9.8",
    );
  });

  it("returns undefined when package is missing", () => {
    expectVersionNotFound(
      "package-lock.json",
      JSON.stringify({
        lockfileVersion: 3,
        packages: {
          "node_modules/foo": { version: "1.0.0" },
        },
      }),
    );
  });
});
