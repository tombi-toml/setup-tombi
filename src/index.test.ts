import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import * as cache from "@actions/cache";
import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { createHash } from "node:crypto";

const packageJsonVersion = "1.1.0";

vi.mock("@actions/cache");
vi.mock("@actions/core");
vi.mock("@actions/tool-cache");
vi.mock("node:fs", async () => {
  const actual = await vi.importActual("node:fs");
  return {
    ...actual,
    existsSync: vi.fn(),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn(),
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

const execSyncMock = vi.fn();

vi.mock("node:child_process", () => ({
  execSync: execSyncMock,
}));

describe("setup-tombi action", () => {
  const mockScriptPath = "/tmp/install.sh";
  const installScriptUrl = "https://tombi-toml.github.io/tombi/install.sh";

  function setInputs(
    overrides: Partial<
      Record<"version" | "lockfile" | "checksum" | "enable-cache", string>
    > = {},
  ): void {
    const inputValues = {
      version: "",
      lockfile: "",
      checksum: "",
      "enable-cache": "auto",
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
    vi.unstubAllEnvs();
    vi.stubEnv("RUNNER_ENVIRONMENT", "github-hosted");
    vi.stubEnv("XDG_CACHE_HOME", "");
    vi.stubEnv("LOCALAPPDATA", "");

    vi.mocked(os.platform).mockReturnValue("linux");
    vi.mocked(os.arch).mockReturnValue("x64");
    vi.mocked(os.homedir).mockReturnValue("/home/user");

    vi.mocked(tc.downloadTool).mockResolvedValue(mockScriptPath);
    vi.mocked(cache.restoreCache).mockResolvedValue(undefined);
    vi.mocked(fs.existsSync).mockReturnValue(true);
    vi.mocked(fs.readFileSync).mockReturnValue(
      JSON.stringify({ version: packageJsonVersion }),
    );
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
    vi.unstubAllEnvs();
  });

  describe("Linux", () => {
    it("uses install.sh script with install-dir", async () => {
      await runAction();

      expect(tc.downloadTool).toHaveBeenCalledWith(installScriptUrl);
      expect(cache.restoreCache).toHaveBeenCalledWith(
        ["/home/user/.cache/tombi"],
        `setup-tombi-v1-linux-x64-${packageJsonVersion}--home-user-.cache-tombi`,
        ["setup-tombi-v1-linux-x64-"],
      );
      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version ${packageJsonVersion} --install-dir "/home/user/.local/bin"`,
        { stdio: "inherit" },
      );
      expect(core.addPath).toHaveBeenCalledWith("/home/user/.local/bin");
      expect(core.exportVariable).toHaveBeenCalledWith(
        "TOMBI_CACHE_HOME",
        "/home/user/.cache/tombi",
      );
    });

    it("installs the setup-tombi release version by default", async () => {
      await runAction();

      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version ${packageJsonVersion} --install-dir "/home/user/.local/bin"`,
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

    it("uses TOMBI_CACHE_HOME when provided", async () => {
      vi.stubEnv("TOMBI_CACHE_HOME", "/tmp/tombi-cache");

      await runAction();

      expect(cache.restoreCache).toHaveBeenCalledWith(
        ["/tmp/tombi-cache"],
        `setup-tombi-v1-linux-x64-${packageJsonVersion}--tmp-tombi-cache`,
        ["setup-tombi-v1-linux-x64-"],
      );
      expect(core.exportVariable).toHaveBeenCalledWith(
        "TOMBI_CACHE_HOME",
        "/tmp/tombi-cache",
      );
    });

    it("warns and continues when cache restore fails", async () => {
      vi.mocked(cache.restoreCache).mockRejectedValue(
        new Error("cache backend unavailable"),
      );

      await runAction();

      expect(core.warning).toHaveBeenCalledWith("cache backend unavailable");
      expect(core.setOutput).toHaveBeenCalledWith("cache-hit", "false");
      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version ${packageJsonVersion} --install-dir "/home/user/.local/bin"`,
        { stdio: "inherit" },
      );
      expect(core.setFailed).not.toHaveBeenCalled();
    });

    it("skips cache restore when disabled", async () => {
      setInputs({ "enable-cache": "false" });

      await runAction();

      expect(cache.restoreCache).not.toHaveBeenCalled();
    });

    it("disables auto cache on self-hosted runners", async () => {
      vi.stubEnv("RUNNER_ENVIRONMENT", "self-hosted");

      await runAction();

      expect(cache.restoreCache).not.toHaveBeenCalled();
    });
  });

  describe("Windows", () => {
    beforeEach(() => {
      vi.mocked(os.platform).mockReturnValue("win32");
      vi.mocked(os.homedir).mockReturnValue("C:\\Users\\user");
      vi.stubEnv("LOCALAPPDATA", "C:\\Users\\user\\AppData\\Local");
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

    it("uses LOCALAPPDATA for the default cache directory", async () => {
      await runAction();

      expect(cache.restoreCache).toHaveBeenCalledWith(
        [path.join("C:\\Users\\user\\AppData\\Local", "tombi", "cache")],
        `setup-tombi-v1-win32-x64-${packageJsonVersion}-C-Users-user-AppData-Local-tombi-cache`,
        ["setup-tombi-v1-win32-x64-"],
      );
    });
  });

  describe("macOS", () => {
    beforeEach(() => {
      vi.mocked(os.platform).mockReturnValue("darwin");
      vi.mocked(os.homedir).mockReturnValue("/Users/user");
      vi.stubEnv("XDG_CACHE_HOME", "");
    });

    it("uses install.sh script", async () => {
      await runAction();

      expect(tc.downloadTool).toHaveBeenCalledWith(installScriptUrl);
      expect(execSyncMock).toHaveBeenCalledWith(
        `bash "${mockScriptPath}" --version ${packageJsonVersion} --install-dir "/Users/user/.local/bin"`,
        { stdio: "inherit" },
      );
    });

    it("uses Library/Caches for the default cache directory", async () => {
      await runAction();

      expect(cache.restoreCache).toHaveBeenCalledWith(
        ["/Users/user/Library/Caches/tombi"],
        `setup-tombi-v1-darwin-x64-${packageJsonVersion}--Users-user-Library-Caches-tombi`,
        ["setup-tombi-v1-darwin-x64-"],
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

    it("fails when enable-cache has an invalid value", async () => {
      setInputs({ "enable-cache": "sometimes" });

      await runAction();

      expect(core.setFailed).toHaveBeenCalledWith(
        'Input `enable-cache` must be one of "true", "false", or "auto".',
      );
    });

    it("fails when enable-cache is empty", async () => {
      setInputs({ "enable-cache": "" });

      await runAction();

      expect(core.setFailed).toHaveBeenCalledWith(
        'Input `enable-cache` must be one of "true", "false", or "auto".',
      );
    });
  });
});
