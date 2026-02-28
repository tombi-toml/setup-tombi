import {
  PYTHON_PACKAGE_ALIASES,
  cleanResolvedVersion,
  isTargetPackage,
} from "./common";

function splitUvPackageBlocks(content: string): string[] {
  return content.split(/^\s*\[\[package\]\]\s*$/m).slice(1);
}

function matchUvPackageName(packageBlock: string): string | undefined {
  const nameMatch = packageBlock.match(/^\s*name\s*=\s*["']([^"']+)["']/m);
  return nameMatch?.[1];
}

function matchUvPackageVersion(packageBlock: string): string | undefined {
  const versionMatch = packageBlock.match(
    /^\s*version\s*=\s*["']([^"']+)["']/m,
  );
  if (versionMatch?.[1]) {
    return cleanResolvedVersion(versionMatch[1]);
  }
  return undefined;
}

export function extractVersionFromUvLock(content: string): string | undefined {
  for (const packageBlock of splitUvPackageBlocks(content)) {
    const packageName = matchUvPackageName(packageBlock);
    if (!packageName || !isTargetPackage(packageName, PYTHON_PACKAGE_ALIASES)) {
      continue;
    }

    const version = matchUvPackageVersion(packageBlock);
    if (version) {
      return version;
    }
  }

  return undefined;
}
