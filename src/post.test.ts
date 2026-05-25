import { describe, it, expect, vi, beforeEach } from "vitest";
import * as cache from "@actions/cache";
import * as core from "@actions/core";
import * as fs from "node:fs";

const packageJsonVersion = (require("../package.json") as { version: string })
  .version;

vi.mock("@actions/cache");
vi.mock("@actions/core");
vi.mock("node:fs", async () => {
  const actual = await vi.importActual("node:fs");
  return {
    ...actual,
    existsSync: vi.fn(),
  };
});

describe("setup-tombi post action", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.resetAllMocks();

    vi.mocked(core.getState).mockImplementation((name: string) => {
      switch (name) {
        case "cache-enabled":
          return "true";
        case "cache-key":
          return `setup-tombi-v1-linux-x64-${packageJsonVersion}-tmp-cache`;
        case "cache-path":
          return "/tmp/cache";
        default:
          return "";
      }
    });
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(cache.saveCache).mockResolvedValue(1);
  });

  it("saves the restored cache in the post step", async () => {
    const { runPost } = await import("./post");
    await runPost();

    expect(cache.saveCache).toHaveBeenCalledWith(
      ["/tmp/cache"],
      `setup-tombi-v1-linux-x64-${packageJsonVersion}-tmp-cache`,
    );
  });
});
