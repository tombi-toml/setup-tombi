import {
  TYPESCRIPT_PACKAGE_ALIASES,
  asRecord,
  cleanResolvedVersion,
} from "./common";

function findVersionInDependencyMap(
  dependencies: Record<string, unknown>,
): string | undefined {
  for (const packageName of TYPESCRIPT_PACKAGE_ALIASES) {
    const dependencyValue = asRecord(dependencies[packageName]);
    if (!dependencyValue) {
      continue;
    }

    if (typeof dependencyValue.version === "string") {
      return cleanResolvedVersion(dependencyValue.version);
    }
  }

  for (const dependencyValue of Object.values(dependencies)) {
    const dependency = asRecord(dependencyValue);
    if (!dependency) {
      continue;
    }

    const nestedDependencies = asRecord(dependency.dependencies);
    if (!nestedDependencies) {
      continue;
    }

    const nestedVersion = findVersionInDependencyMap(nestedDependencies);
    if (nestedVersion) {
      return nestedVersion;
    }
  }

  return undefined;
}

export function extractVersionFromPackageLock(
  content: string,
): string | undefined {
  const parsed = JSON.parse(content);
  const lockfile = asRecord(parsed);
  if (!lockfile) {
    return undefined;
  }

  const packages = asRecord(lockfile.packages);
  if (packages) {
    for (const packageName of TYPESCRIPT_PACKAGE_ALIASES) {
      for (const packagePath of [
        `node_modules/${packageName}`,
        packageName,
      ] as const) {
        const packageInfo = asRecord(packages[packagePath]);
        if (packageInfo && typeof packageInfo.version === "string") {
          return cleanResolvedVersion(packageInfo.version);
        }
      }
    }
  }

  const dependencies = asRecord(lockfile.dependencies);
  if (dependencies) {
    return findVersionInDependencyMap(dependencies);
  }

  return undefined;
}
