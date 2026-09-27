import {
  MISE_TOOL_ALIASES,
  cleanResolvedVersion,
  isTargetPackage,
} from "./common";

export function extractVersionFromMiseLock(
  content: string,
): string | undefined {
  const lines = content.split(/\r?\n/);

  for (let i = 0; i < lines.length; i += 1) {
    const headerMatch = lines[i].match(
      /^\s*\[\[tools\.(?:"([^"]+)"|([^\]]+))\]\]\s*$/,
    );
    if (!headerMatch) {
      continue;
    }

    const toolName = headerMatch[1] ?? headerMatch[2]?.trim();
    if (!toolName || !isTargetPackage(toolName, MISE_TOOL_ALIASES)) {
      continue;
    }

    for (let j = i + 1; j < lines.length; j += 1) {
      if (/^\s*\[\[tools\./.test(lines[j])) {
        break;
      }

      const versionMatch = lines[j].match(/^\s*version\s*=\s*["']([^"']+)["']/);
      if (versionMatch?.[1]) {
        return cleanResolvedVersion(versionMatch[1]);
      }
    }
  }

  return undefined;
}
