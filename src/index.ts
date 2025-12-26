import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

function isWindows(): boolean {
  return os.platform() === "win32";
}

function getInstallDir(): string {
  // install.sh always installs to ~/.local/bin
  return path.join(os.homedir(), ".local", "bin");
}

function getBinaryName(): string {
  return isWindows() ? "tombi.exe" : "tombi";
}

export async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    const checksum = core.getInput("checksum") || undefined;

    // Add to PATH first (install.sh may check this)
    const installDir = getInstallDir();
    core.addPath(installDir);

    // Download the install script
    const installScriptUrl = "https://tombi-toml.github.io/tombi/install.sh";
    core.info("Downloading Tombi install script...");
    const scriptPath = await tc.downloadTool(installScriptUrl);

    // Build version argument
    const versionArg = version ? `--version ${version}` : "";

    // Execute the install script using bash
    core.info(`Installing Tombi${version ? ` version ${version}` : ""}...`);
    const command = `bash "${scriptPath}" ${versionArg}`.trim();
    core.info(`Execute: ${command}`);

    try {
      execSync(command, { stdio: "inherit" });
    } catch {
      // install.sh may exit with non-zero even on success (known issue on Windows)
      core.warning("Install script exited with non-zero code, checking if binary exists...");
    }

    const binaryPath = path.join(installDir, getBinaryName());

    // Verify binary exists
    if (!fs.existsSync(binaryPath)) {
      throw new Error(`Binary not found at ${binaryPath}`);
    }

    if (checksum) {
      const fileBuffer = await fs.promises.readFile(binaryPath);
      const hashSum = createHash("sha256");
      hashSum.update(fileBuffer);
      const hex = hashSum.digest("hex");

      if (hex !== checksum) {
        throw new Error(
          `Checksum verification failed. Expected: ${checksum}, Got: ${hex}`,
        );
      }
      core.info("Checksum verification passed");
    }

    const versionOutput = execSync(`"${binaryPath}" --version`, {
      encoding: "utf8",
    });
    if (!versionOutput) {
      throw new Error("Failed to verify installation: no version output");
    }
    core.info(`Tombi installed successfully: ${versionOutput.trim()}`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unexpected error occurred");
    }
  }
}

run();
