import {
  PYTHON_PACKAGE_ALIASES,
  cleanResolvedVersion,
  isTargetPackage,
} from "./common";

function splitPoetryPackageBlocks(content: string): string[] {
  return content.split(/^\s*\[\[package\]\]\s*$/m).slice(1);
}

function matchPoetryPackageName(packageBlock: string): string | undefined {
  const nameMatch = packageBlock.match(/^\s*name\s*=\s*["']([^"']+)["']/m);
  return nameMatch?.[1];
}

function matchPoetryPackageVersion(packageBlock: string): string | undefined {
  const versionMatch = packageBlock.match(
    /^\s*version\s*=\s*["']([^"']+)["']/m,
  );
  if (versionMatch?.[1]) {
    return cleanResolvedVersion(versionMatch[1]);
  }
  return undefined;
}

export function extractVersionFromPoetryLock(
  content: string,
): string | undefined {
  for (const packageBlock of splitPoetryPackageBlocks(content)) {
    const packageName = matchPoetryPackageName(packageBlock);
    if (!packageName || !isTargetPackage(packageName, PYTHON_PACKAGE_ALIASES)) {
      continue;
    }

    const version = matchPoetryPackageVersion(packageBlock);
    if (version) {
      return version;
    }
  }

  return undefined;
}
