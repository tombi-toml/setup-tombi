import { describe, it } from "vitest";
import { expectResolvedVersion, expectVersionNotFound } from "./helpers";

describe("uv.lock parser", () => {
  it("resolves version from tombi package block", () => {
    expectResolvedVersion(
      "uv.lock",
      `
[[package]]
name = "tombi"
version = "0.9.1"
`,
      "0.9.1",
    );
  });

  it("does not resolve TypeScript alias package name", () => {
    expectVersionNotFound(
      "uv.lock",
      `
[[package]]
name = "@tombi-toml/tombi"
version = "0.9.2"
`,
    );
  });

  it("returns undefined when package is missing", () => {
    expectVersionNotFound(
      "uv.lock",
      `
[[package]]
name = "other"
version = "1.0.0"
`,
    );
  });
});
