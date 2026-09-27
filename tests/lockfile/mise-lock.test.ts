import { describe, it } from "vitest";
import { expectResolvedVersion, expectVersionNotFound } from "./helpers";

describe("mise.lock parser", () => {
  it("resolves version from a tombi tool entry", () => {
    expectResolvedVersion(
      "mise.lock",
      `
lockfile_version = 2

[[tools.tombi]]
version = "0.10.4"
backend = "aqua:tombi-toml/tombi"
`,
      "0.10.4",
    );
  });

  it("resolves version from a quoted aqua tool entry", () => {
    expectResolvedVersion(
      "mise.lock",
      `
[[tools."aqua:tombi-toml/tombi"]]
backend = "aqua:tombi-toml/tombi"
version = "0.10.5"
`,
      "0.10.5",
    );
  });

  it("returns undefined when the tool is missing", () => {
    expectVersionNotFound(
      "mise.lock",
      `
[[tools.node]]
version = "22.0.0"
`,
    );
  });
});
