import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { createHash } from "node:crypto";

// Mock the modules
vi.mock("@actions/core");
vi.mock("@actions/tool-cache");
vi.mock("fs");
vi.mock("os");

// Create mock for execSync
const execSyncMock = vi.fn();

// Mock child_process module
vi.mock("child_process", () => ({
  execSync: execSyncMock,
}));

describe("setup-tombi action", () => {
  const mockScriptPath = "/tmp/install.sh";
  const mockBinDirPath = "/home/user/.local/bin";
  const mockTombiBinPath = path.join(mockBinDirPath, "tombi");

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();

    // Setup default mock implementations
    vi.mocked(os.platform).mockReturnValue("linux");
    vi.mocked(os.arch).mockReturnValue("x64");
    vi.mocked(os.homedir).mockReturnValue("/home/user");
    vi.mocked(tc.downloadTool).mockResolvedValue(mockScriptPath);
    vi.mocked(fs.promises.chmod).mockResolvedValue(undefined);
    execSyncMock.mockReturnValue(undefined);
    vi.mocked(core.getInput).mockImplementation((name: string) => {
      switch (name) {
        case "version":
          return "latest";
        case "checksum":
          return "";
        case "working-directory":
          return ".";
        default:
          return "";
      }
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("downloads and installs latest version of Tombi", async () => {
    const { run } = await import("./index");

    await run();

    // Verify the installation process
    expect(tc.downloadTool).toHaveBeenCalledWith(
      "https://tombi-toml.github.io/tombi/install.sh",
    );
    expect(fs.promises.chmod).toHaveBeenCalledWith(mockScriptPath, "755");
    expect(execSyncMock).toHaveBeenCalledWith(
      `${mockScriptPath} --version latest`,
      {
        stdio: "inherit",
      },
    );
    expect(core.addPath).toHaveBeenCalledWith(mockTombiBinPath);
  });

  it("installs specific version of Tombi", async () => {
    vi.mocked(core.getInput).mockImplementation((name: string) => {
      switch (name) {
        case "version":
          return "0.3.31";
        default:
          return "";
      }
    });

    const { run } = await import("./index");
    await run();

    expect(tc.downloadTool).toHaveBeenCalledWith(
      "https://tombi-toml.github.io/tombi/install.sh",
    );
  });

  it("verifies checksum when provided", async () => {
    const mockChecksum = "mock-checksum";
    const mockFileContent = "mock-file-content";

    vi.mocked(core.getInput).mockImplementation((name: string) => {
      switch (name) {
        case "version":
          return "0.3.31";
        case "checksum":
          return mockChecksum;
        default:
          return "";
      }
    });

    vi.mocked(fs.promises.readFile).mockResolvedValue(
      Buffer.from(mockFileContent),
    );

    const hash = createHash("sha256");
    hash.update(mockFileContent);
    const expectedChecksum = hash.digest("hex");

    vi.mocked(core.getInput).mockImplementation((name: string) => {
      switch (name) {
        case "checksum":
          return expectedChecksum;
        case "version":
          return "0.3.31";
        default:
          return "";
      }
    });

    const { run } = await import("./index");
    await run();

    expect(execSyncMock).toHaveBeenCalledWith(
      `${mockScriptPath} --version 0.3.31`,
      { stdio: "inherit" },
    );
    expect(fs.promises.readFile).toHaveBeenCalledWith(mockTombiBinPath);
  });

  it("handles installation errors", async () => {
    const mockError = new Error("Installation failed");
    vi.mocked(tc.downloadTool).mockRejectedValue(mockError);

    const { run } = await import("./index");
    await run();

    expect(core.setFailed).toHaveBeenCalledWith(mockError.message);
  });
});
