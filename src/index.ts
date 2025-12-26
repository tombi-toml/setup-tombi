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
  return path.join(os.homedir(), ".local", "bin");
}

function getBinaryName(): string {
  return isWindows() ? "tombi.exe" : "tombi";
}

async function installWithScript(version: string): Promise<void> {
  const installScriptUrl = "https://tombi-toml.github.io/tombi/install.sh";
  core.info("Downloading Tombi install script...");
  const scriptPath = await tc.downloadTool(installScriptUrl);

  const versionArg = version ? `--version ${version}` : "";
  const command = `bash "${scriptPath}" ${versionArg}`.trim();
  core.info(`Execute: ${command}`);
  execSync(command, { stdio: "inherit" });
}

async function installDirect(version: string): Promise<void> {
  const arch = os.arch() === "arm64" ? "aarch64" : "x86_64";
  const target = `${arch}-pc-windows-msvc`;
  const downloadUrl = `https://github.com/tombi-toml/tombi/releases/download/v${version}/tombi-cli-${version}-${target}.zip`;

  core.info(`Downloading from: ${downloadUrl}`);
  const archivePath = await tc.downloadTool(downloadUrl);

  const installDir = getInstallDir();
  await fs.promises.mkdir(installDir, { recursive: true });

  core.info(`Extracting to: ${installDir}`);
  await tc.extractZip(archivePath, installDir);
}

async function getLatestVersion(): Promise<string> {
  const response = await fetch(
    "https://api.github.com/repos/tombi-toml/tombi/releases/latest",
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "setup-tombi",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch latest version: ${response.statusText}`);
  }

  const data = (await response.json()) as { tag_name: string };
  return data.tag_name.replace(/^v/, "");
}

export async function run(): Promise<void> {
  try {
    let version = core.getInput("version");
    const checksum = core.getInput("checksum") || undefined;

    // Resolve version if needed
    if (!version || version === "latest") {
      core.info("Fetching latest version...");
      version = await getLatestVersion();
    }
    core.info(`Installing Tombi version ${version}...`);

    // Add to PATH
    const installDir = getInstallDir();
    core.addPath(installDir);

    // Install based on platform
    if (isWindows()) {
      // Direct download for Windows (install.sh has bugs with .zip files)
      await installDirect(version);
    } else {
      // Use install.sh for Linux/macOS
      await installWithScript(version);
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
