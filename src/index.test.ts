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
vi.mock("node:fs", async () => {
  const actual = await vi.importActual("node:fs");
  return {
    ...actual,
    existsSync: vi.fn(),
    promises: {
      mkdir: vi.fn(),
      readFile: vi.fn(),
    },
  };
});
vi.mock("os");

// Create mock for execSync
const execSyncMock = vi.fn();

// Mock child_process module
vi.mock("child_process", () => ({
  execSync: execSyncMock,
}));

// Mock global fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe("setup-tombi action", () => {
  const mockScriptPath = "/tmp/install.sh";
  const mockArchivePath = "/tmp/tombi.zip";

  beforeEach(() => {
    vi.resetAllMocks();

    vi.mocked(os.platform).mockReturnValue("linux");
    vi.mocked(os.arch).mockReturnValue("x64");
    vi.mocked(os.homedir).mockReturnValue("/home/user");

    vi.mocked(tc.downloadTool).mockResolvedValue(mockScriptPath);
    vi.mocked(tc.extractZip).mockResolvedValue("/tmp/extracted");
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.promises.mkdir).mockResolvedValue(undefined);

    execSyncMock.mockReturnValue("tombi 0.7.11\n");

    fetchMock.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ tag_name: "v0.7.11" }),
    });

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

  describe("Linux/macOS", () => {
    it("uses install.sh script", async () => {
      const { run } = await import("./index");
      await run();

      expect(tc.downloadTool).toHaveBeenCalledWith(
        "https://tombi-toml.github.io/tombi/install.sh",
      );
      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version 0.7.11`,
        { stdio: "inherit" },
      );
      expect(core.addPath).toHaveBeenCalledWith("/home/user/.local/bin");
    });

    it("installs specific version", async () => {
      vi.mocked(core.getInput).mockImplementation((name: string) => {
        switch (name) {
          case "version":
            return "0.7.0";
          default:
            return "";
        }
      });

      const { run } = await import("./index");
      await run();

      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version 0.7.0`,
        { stdio: "inherit" },
      );
    });
  });

  describe("Windows", () => {
    beforeEach(() => {
      vi.mocked(os.platform).mockReturnValue("win32");
      vi.mocked(os.arch).mockReturnValue("x64");
      vi.mocked(os.homedir).mockReturnValue("C:\\Users\\user");
      vi.mocked(tc.downloadTool).mockResolvedValue(mockArchivePath);
    });

    it("downloads zip directly instead of using install.sh", async () => {
      const { run } = await import("./index");
      await run();

      expect(tc.downloadTool).toHaveBeenCalledWith(
        "https://github.com/tombi-toml/tombi/releases/download/v0.7.11/tombi-cli-0.7.11-x86_64-pc-windows-msvc.zip",
      );
      expect(tc.extractZip).toHaveBeenCalledWith(
        mockArchivePath,
        path.join("C:\\Users\\user", ".local", "bin"),
      );
    });

    it("uses aarch64 for arm64", async () => {
      vi.mocked(os.arch).mockReturnValue("arm64");

      const { run } = await import("./index");
      await run();

      expect(tc.downloadTool).toHaveBeenCalledWith(
        "https://github.com/tombi-toml/tombi/releases/download/v0.7.11/tombi-cli-0.7.11-aarch64-pc-windows-msvc.zip",
      );
    });

    it("uses ~/.local/bin for install directory", async () => {
      const { run } = await import("./index");
      await run();

      expect(core.addPath).toHaveBeenCalledWith(
        path.join("C:\\Users\\user", ".local", "bin"),
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

    it("fails if binary not found after install", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      const { run } = await import("./index");
      await run();

      expect(core.setFailed).toHaveBeenCalledWith(
        expect.stringContaining("Binary not found"),
      );
    });

    it("handles fetch error for latest version", async () => {
      fetchMock.mockResolvedValue({
        ok: false,
        statusText: "Not Found",
      });

      const { run } = await import("./index");
      await run();

      expect(core.setFailed).toHaveBeenCalledWith(
        "Failed to fetch latest version: Not Found",
      );
    });
  });
});
