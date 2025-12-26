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

  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(os.platform).mockReturnValue("linux");
    vi.mocked(os.homedir).mockReturnValue("/home/user");

    vi.mocked(tc.downloadTool).mockResolvedValue(mockScriptPath);

    execSyncMock.mockReturnValue("tombi 0.7.11\n");

    vi.mocked(core.getInput).mockImplementation((name: string) => {
      switch (name) {
        case "version":
          return "latest";
        case "checksum":
          return "";
        default:
          return "";
      }
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Linux", () => {
    it("downloads and executes install script", async () => {
      const { run } = await import("./index");
      await run();

      expect(tc.downloadTool).toHaveBeenCalledWith(
        "https://tombi-toml.github.io/tombi/install.sh",
      );
      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version latest`,
        { stdio: "inherit" },
      );
      expect(core.addPath).toHaveBeenCalledWith("/home/user/.local/bin");
    });

    it("installs without version arg when not specified", async () => {
      vi.mocked(core.getInput).mockImplementation((name: string) => {
        switch (name) {
          case "version":
            return "";
          default:
            return "";
        }
      });

      const { run } = await import("./index");
      await run();

      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}"`,
        { stdio: "inherit" },
      );
    });
  });

  describe("Windows", () => {
    beforeEach(() => {
      vi.mocked(os.platform).mockReturnValue("win32");
      process.env.LOCALAPPDATA = "C:\\Users\\user\\AppData\\Local";
    });

    afterEach(() => {
      process.env.LOCALAPPDATA = undefined;
    });

    it("uses bash to execute install script on Windows", async () => {
      const { run } = await import("./index");
      await run();

      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version latest`,
        { stdio: "inherit" },
      );
    });

    it("uses LOCALAPPDATA for install directory", async () => {
      const { run } = await import("./index");
      await run();

      expect(core.addPath).toHaveBeenCalledWith(
        path.join("C:\\Users\\user\\AppData\\Local", "tombi", "bin"),
      );
    });
  });

  describe("checksum verification", () => {
    it("verifies checksum when provided", async () => {
      const mockFileContent = "mock-file-content";
      const hash = createHash("sha256");
      hash.update(mockFileContent);
      const expectedChecksum = hash.digest("hex");

      vi.mocked(core.getInput).mockImplementation((name: string) => {
        switch (name) {
          case "checksum":
            return expectedChecksum;
          case "version":
            return "0.7.0";
          default:
            return "";
        }
      });

      vi.mocked(fs.promises.readFile).mockResolvedValue(
        Buffer.from(mockFileContent),
      );

      const { run } = await import("./index");
      await run();

      expect(fs.promises.readFile).toHaveBeenCalled();
      expect(core.info).toHaveBeenCalledWith("Checksum verification passed");
    });

    it("fails when checksum does not match", async () => {
      vi.mocked(core.getInput).mockImplementation((name: string) => {
        switch (name) {
          case "checksum":
            return "incorrect-checksum";
          case "version":
            return "0.7.0";
          default:
            return "";
        }
      });

      vi.mocked(fs.promises.readFile).mockResolvedValue(
        Buffer.from("mock-content"),
      );

      const { run } = await import("./index");
      await run();

      expect(core.setFailed).toHaveBeenCalledWith(
        expect.stringContaining("Checksum verification failed"),
      );
    });
  });

  describe("error handling", () => {
    it("handles download errors", async () => {
      const mockError = new Error("Download failed");
      vi.mocked(tc.downloadTool).mockRejectedValue(mockError);

      const { run } = await import("./index");
      await run();

      expect(core.setFailed).toHaveBeenCalledWith(mockError.message);
    });
  });
});
