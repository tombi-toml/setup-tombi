import {
  TYPESCRIPT_PACKAGE_ALIASES,
  cleanResolvedVersion,
  escapeRegex,
} from "./common";

function getYarnAliasSelectorPattern(packageName: string): RegExp {
  return new RegExp(String.raw`(^|[\s,"'])${escapeRegex(packageName)}@`);
}

function hasYarnPackageSelector(header: string): boolean {
  const headerWithoutColon = header.replace(/:\s*$/, "");
  return TYPESCRIPT_PACKAGE_ALIASES.some((packageName) => {
    return getYarnAliasSelectorPattern(packageName).test(headerWithoutColon);
  });
}

function matchYarnV1VersionLine(line: string): string | undefined {
  const yarnV1Match = line.match(/^\s*version\s+"([^"]+)"/);
  if (yarnV1Match?.[1]) {
    return cleanResolvedVersion(yarnV1Match[1]);
  }
  return undefined;
}

function matchYarnV2VersionLine(line: string): string | undefined {
  const yarnV2Match = line.match(/^\s*version\s*:\s*["']?([^"'\s]+)["']?/);
  if (yarnV2Match?.[1]) {
    return cleanResolvedVersion(yarnV2Match[1]);
  }
  return undefined;
}

export function extractVersionFromYarnLock(
  content: string,
): string | undefined {
  const lines = content.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const headerLine = lines[i];
    if (/^\s/.test(headerLine) || !headerLine.trimEnd().endsWith(":")) {
      continue;
    }
    if (!hasYarnPackageSelector(headerLine.trim())) {
      continue;
    }

    for (let j = i + 1; j < lines.length; j += 1) {
      const detailLine = lines[j];
      if (!/^\s/.test(detailLine) && detailLine.trimEnd().endsWith(":")) {
        break;
      }

      const yarnV1Version = matchYarnV1VersionLine(detailLine);
      if (yarnV1Version) {
        return yarnV1Version;
      }

      const yarnV2Version = matchYarnV2VersionLine(detailLine);
      if (yarnV2Version) {
        return yarnV2Version;
      }
    }
  }

  return undefined;
}
