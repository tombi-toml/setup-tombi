export const PYTHON_PACKAGE_ALIASES = ["tombi"] as const;
export const TYPESCRIPT_PACKAGE_ALIASES = [
  "tombi",
  "@tombi-toml/tombi",
] as const;

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function asRecord(value: unknown): Record<string, unknown> | undefined {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

export function getIndent(line: string): number {
  return line.match(/^\s*/)?.[0].length ?? 0;
}

export function isTargetPackage(
  name: string,
  packageAliases: readonly string[],
): boolean {
  return packageAliases.some((alias) => alias === name);
}

export function cleanResolvedVersion(version: string): string {
  const withoutQuotes = version.trim().replace(/^["']|["']$/g, "");
  const withoutDelimiter = withoutQuotes.replace(/[,:]$/, "");
  const withoutPeerSuffix = withoutDelimiter.split("(")[0].trim();
  if (withoutPeerSuffix.startsWith("npm:")) {
    return withoutPeerSuffix.slice(4);
  }
  return withoutPeerSuffix;
}
