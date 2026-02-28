import { execSync } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import { expect } from "vitest";
import { resolveVersionFromLockfile } from "../../../src/lockfile";

export const GENERATED_LOCKFILE_TEST_ENABLED =
  process.env.LOCKFILE_GENERATION_TEST === "1";

export async function withTempProject(
  prefix: string,
  callback: (projectDir: string) => Promise<void>,
): Promise<void> {
  const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  try {
    await callback(projectDir);
  } finally {
    fs.rmSync(projectDir, { recursive: true, force: true });
  }
}

export function runCommand(command: string, projectDir: string): void {
  execSync(command, {
    cwd: projectDir,
    stdio: "pipe",
    env: {
      ...process.env,
      CI: "1",
    },
  });
}

export async function expectResolvableVersion(
  projectDir: string,
  lockfileName: string,
): Promise<void> {
  const lockfilePath = path.join(projectDir, lockfileName);
  expect(fs.existsSync(lockfilePath)).toBe(true);

  const resolvedVersion = await resolveVersionFromLockfile(lockfilePath);
  expect(resolvedVersion).toMatch(/^\d+\.\d+\.\d+(?:[-+].+)?$/);
}
