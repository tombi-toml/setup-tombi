import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";
import * as path from "node:path";
import * as os from "node:os";
import * as fs from "node:fs";
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";

export async function run(): Promise<void> {
  try {
    const version = core.getInput("version");
    const checksum = core.getInput("checksum") || undefined;

    // Determine the download URL based on version and platform
    const baseUrl = "https://tombi-toml.github.io/tombi/install.sh";

    // Download the install script
    core.info("Downloading Tombi install script...");
    const scriptPath = await tc.downloadTool(baseUrl);

    // Make the script executable
    await fs.promises.chmod(scriptPath, "755");

    // Execute the install script with appropriate version if specified
    const versionArgs = [];
    if (version) {
      versionArgs.push(` --version ${version}`);
    }

    core.info(`Installing Tombi${versionArgs.join("")}...`);
    core.info(`Execute: ${scriptPath}${versionArgs.join("")}`);
    execSync(`${scriptPath}${versionArgs.join("")}`, { stdio: "inherit" });

    // Add Tombi to PATH
    const binPath = path.join(os.homedir(), ".local", "bin", "tombi");
    core.addPath(binPath);

    // Verify checksum if provided
    if (checksum) {
      const fileBuffer = await fs.promises.readFile(binPath);
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

    core.info("Tombi installed successfully");
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed("An unexpected error occurred");
    }
  }
}

run();
