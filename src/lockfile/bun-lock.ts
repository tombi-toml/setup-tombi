import {
  TYPESCRIPT_PACKAGE_ALIASES,
  cleanResolvedVersion,
  escapeRegex,
} from "./index";

function getBunPackagePattern(packageName: string): RegExp {
  return new RegExp(
    String.raw`${escapeRegex(packageName)}@([0-9][0-9A-Za-z.+-]*)`,
  );
}

function matchBunPackageVersion(
  content: string,
  packageName: string,
): string | undefined {
  const packageMatch = content.match(getBunPackagePattern(packageName));
  if (packageMatch?.[1]) {
    return cleanResolvedVersion(packageMatch[1]);
  }
  return undefined;
}

export function extractVersionFromBunLock(content: string): string | undefined {
  for (const packageName of TYPESCRIPT_PACKAGE_ALIASES) {
    const version = matchBunPackageVersion(content, packageName);
    if (version) {
      return version;
    }
  }
  return undefined;
}
