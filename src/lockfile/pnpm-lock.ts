import {
  TYPESCRIPT_PACKAGE_ALIASES,
  cleanResolvedVersion,
  escapeRegex,
  getIndent,
} from "./index";

function getPnpmPackageKeyPattern(packageName: string): RegExp {
  return new RegExp(
    String.raw`^\s*['"]?\/?${escapeRegex(packageName)}@([^:'"\s)]+)[^:]*:\s*$`,
    "m",
  );
}

function getPnpmDependencyLinePattern(packageName: string): RegExp {
  return new RegExp(
    String.raw`^\s*['"]?${escapeRegex(packageName)}['"]?\s*:\s*$`,
  );
}

function matchPnpmPackageKeyVersion(
  content: string,
  packageName: string,
): string | undefined {
  const packageKeyMatch = content.match(getPnpmPackageKeyPattern(packageName));
  if (packageKeyMatch?.[1]) {
    return cleanResolvedVersion(packageKeyMatch[1]);
  }
  return undefined;
}

function matchPnpmDependencyVersionLine(line: string): string | undefined {
  const versionMatch = line.match(/^\s*version\s*:\s*["']?([^"'\s#]+)["']?/);
  if (versionMatch?.[1]) {
    return cleanResolvedVersion(versionMatch[1]);
  }
  return undefined;
}

export function extractVersionFromPnpmLock(
  content: string,
): string | undefined {
  for (const packageName of TYPESCRIPT_PACKAGE_ALIASES) {
    const version = matchPnpmPackageKeyVersion(content, packageName);
    if (version) {
      return version;
    }
  }

  const lines = content.split(/\r?\n/);
  for (const packageName of TYPESCRIPT_PACKAGE_ALIASES) {
    const dependencyLinePattern = getPnpmDependencyLinePattern(packageName);

    for (let i = 0; i < lines.length; i += 1) {
      if (!dependencyLinePattern.test(lines[i])) {
        continue;
      }

      const baseIndent = getIndent(lines[i]);
      for (let j = i + 1; j < lines.length; j += 1) {
        const nextLine = lines[j];
        if (nextLine.trim() === "") {
          continue;
        }

        const nextIndent = getIndent(nextLine);
        if (nextIndent <= baseIndent) {
          break;
        }

        const version = matchPnpmDependencyVersionLine(nextLine);
        if (version) {
          return version;
        }
      }
    }
  }

  return undefined;
}
