import { describe, it } from "vitest";
import { expectResolvedVersion, expectVersionNotFound } from "./helpers";

describe("poetry.lock parser", () => {
  it("resolves version from tombi package block", () => {
    expectResolvedVersion(
      "poetry.lock",
      `
[[package]]
name = "tombi"
version = "0.8.7"
`,
      "0.8.7",
    );
  });

  it("does not resolve TypeScript alias package name", () => {
    expectVersionNotFound(
      "poetry.lock",
      `
[[package]]
name = "@tombi-toml/tombi"
version = "0.8.8"
`,
    );
  });

  it("returns undefined when package is missing", () => {
    expectVersionNotFound(
      "poetry.lock",
      `
[[package]]
name = "not-tombi"
version = "1.0.0"
`,
    );
  });
});
