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
      ...actual.promises,
      readFile: vi.fn(),
    },
  };
});

vi.mock("node:os");
vi.mock("./lockfile", () => ({
  resolveVersionFromLockfile: vi.fn(),
}));

// Create mock for execSync
const execSyncMock = vi.fn();

// Mock child_process module
vi.mock("node:child_process", () => ({
  execSync: execSyncMock,
}));

describe("setup-tombi action", () => {
  const mockScriptPath = "/tmp/install.sh";
  const installScriptUrl = "https://tombi-toml.github.io/tombi/install.sh";

  function setInputs(
    overrides: Partial<
      Record<"version" | "lockfile" | "checksum", string>
    > = {},
  ): void {
    const inputValues = {
      version: "latest",
      lockfile: "",
      checksum: "",
      ...overrides,
    };

    vi.mocked(core.getInput).mockImplementation((name: string) => {
      if (name in inputValues) {
        return inputValues[name as keyof typeof inputValues];
      }
      return "";
    });
  }

  async function runAction(): Promise<void> {
    const { run } = await import("./index");
    await run();
  }

  beforeEach(async () => {
    vi.resetModules();
    vi.resetAllMocks();

    vi.mocked(os.platform).mockReturnValue("linux");
    vi.mocked(os.homedir).mockReturnValue("/home/user");

    vi.mocked(tc.downloadTool).mockResolvedValue(mockScriptPath);
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.promises.readFile).mockResolvedValue(
      Buffer.from("mock-content"),
    );

    const lockfileModule = await import("./lockfile");
    vi.mocked(lockfileModule.resolveVersionFromLockfile).mockResolvedValue(
      "0.7.11",
    );

    execSyncMock.mockReturnValue("tombi 0.7.11\n");

    setInputs();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe("Linux", () => {
    it("uses install.sh script with install-dir", async () => {
      await runAction();

      expect(tc.downloadTool).toHaveBeenCalledWith(installScriptUrl);
      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version latest --install-dir "/home/user/.local/bin"`,
        { stdio: "inherit" },
      );
      expect(core.addPath).toHaveBeenCalledWith("/home/user/.local/bin");
    });

    it("installs without version arg when not specified", async () => {
      setInputs({ version: "" });
      await runAction();

      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --install-dir "/home/user/.local/bin"`,
        { stdio: "inherit" },
      );
    });

    it("resolves version from lockfile when lockfile is specified", async () => {
      const lockfileModule = await import("./lockfile");
      vi.mocked(lockfileModule.resolveVersionFromLockfile).mockResolvedValue(
        "0.7.33",
      );
      setInputs({ version: "", lockfile: "pnpm-lock.yaml" });

      await runAction();

      expect(lockfileModule.resolveVersionFromLockfile).toHaveBeenCalledWith(
        "pnpm-lock.yaml",
      );
      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version 0.7.33 --install-dir "/home/user/.local/bin"`,
        { stdio: "inherit" },
      );
    });
  });

  describe("Windows", () => {
    beforeEach(() => {
      vi.mocked(os.platform).mockReturnValue("win32");
      vi.mocked(os.homedir).mockReturnValue("C:\\Users\\user");
    });

    it("uses bash to execute install.sh", async () => {
      await runAction();

      expect(execSyncMock).toHaveBeenCalledWith(
        expect.stringContaining(`bash "${mockScriptPath}"`),
        { stdio: "inherit" },
      );
    });

    it("uses ~/.local/bin for install directory", async () => {
      await runAction();

      expect(core.addPath).toHaveBeenCalledWith(
        path.join("C:\\Users\\user", ".local", "bin"),
      );
    });
  });

  describe("macOS", () => {
    beforeEach(() => {
      vi.mocked(os.platform).mockReturnValue("darwin");
      vi.mocked(os.homedir).mockReturnValue("/Users/user");
    });

    it("uses install.sh script", async () => {
      await runAction();

      expect(tc.downloadTool).toHaveBeenCalledWith(installScriptUrl);
      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version latest --install-dir "/Users/user/.local/bin"`,
        { stdio: "inherit" },
      );
    });
  });

  describe("checksum verification", () => {
    it("verifies checksum when provided", async () => {
      const mockFileContent = "mock-file-content";
      const hash = createHash("sha256");
      hash.update(mockFileContent);
      const expectedChecksum = hash.digest("hex");

      setInputs({ checksum: expectedChecksum, version: "0.7.0" });

      vi.mocked(fs.promises.readFile).mockResolvedValue(
        Buffer.from(mockFileContent),
      );

      await runAction();

      expect(fs.promises.readFile).toHaveBeenCalled();
      expect(core.info).toHaveBeenCalledWith("Checksum verification passed");
    });

    it("fails when checksum does not match", async () => {
      setInputs({ checksum: "incorrect-checksum", version: "0.7.0" });

      vi.mocked(fs.promises.readFile).mockResolvedValue(
        Buffer.from("mock-content"),
      );

      await runAction();

      expect(core.setFailed).toHaveBeenCalledWith(
        expect.stringContaining("Checksum verification failed"),
      );
    });
  });

  describe("error handling", () => {
    it("handles download errors", async () => {
      const mockError = new Error("Download failed");
      vi.mocked(tc.downloadTool).mockRejectedValue(mockError);

      await runAction();

      expect(core.setFailed).toHaveBeenCalledWith(mockError.message);
    });

    it("fails if binary not found after install", async () => {
      vi.mocked(fs.existsSync).mockReturnValue(false);

      await runAction();

      expect(core.setFailed).toHaveBeenCalledWith(
        expect.stringContaining("Binary not found"),
      );
    });

    it("fails when version and lockfile are both provided", async () => {
      const lockfileModule = await import("./lockfile");
      setInputs({ version: "latest", lockfile: "pnpm-lock.yaml" });

      await runAction();

      expect(lockfileModule.resolveVersionFromLockfile).not.toHaveBeenCalled();
      expect(core.setFailed).toHaveBeenCalledWith(
        "Inputs `version` and `lockfile` are mutually exclusive.",
      );
    });
  });
});
