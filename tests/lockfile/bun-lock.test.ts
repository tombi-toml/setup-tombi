import { describe, it } from "vitest";
import { expectResolvedVersion, expectVersionNotFound } from "./helpers";

describe("bun.lock parser", () => {
  it("resolves version from tombi reference", () => {
    expectResolvedVersion(
      "bun.lock",
      `
{
  "packages": {
    "tombi": ["tombi@0.10.2", "", {}, "sha512-xyz"]
  }
}
`,
      "0.10.2",
    );
  });

  it("resolves version from alias package reference", () => {
    expectResolvedVersion(
      "bun.lock",
      `
{
  "packages": {
    "@tombi-toml/tombi": ["@tombi-toml/tombi@0.10.3", "", {}, "sha512-xyz"]
  }
}
`,
      "0.10.3",
    );
  });

  it("returns undefined when package is missing", () => {
    expectVersionNotFound(
      "bun.lock",
      `
{
  "packages": {
    "foo": ["foo@1.0.0", "", {}, "sha512-xyz"]
  }
}
`,
    );
  });
});
