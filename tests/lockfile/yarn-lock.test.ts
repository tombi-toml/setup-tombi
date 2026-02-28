import { describe, it } from "vitest";
import { expectResolvedVersion, expectVersionNotFound } from "./helpers";

describe("yarn.lock parser", () => {
  it("resolves version from Yarn v1 stanza", () => {
    expectResolvedVersion(
      "yarn.lock",
      `
"tombi@^0.9.0":
  version "0.9.9"
  resolved "https://registry.yarnpkg.com/tombi/-/tombi-0.9.9.tgz"
`,
      "0.9.9",
    );
  });

  it("resolves version from Yarn v2 stanza", () => {
    expectResolvedVersion(
      "yarn.lock",
      `
"@tombi-toml/tombi@npm:^0.10.0":
  version: 0.10.1
  resolution: "@tombi-toml/tombi@npm:0.10.1"
`,
      "0.10.1",
    );
  });

  it("returns undefined when package is missing", () => {
    expectVersionNotFound(
      "yarn.lock",
      `
"foo@^1.0.0":
  version "1.0.1"
`,
    );
  });
});
