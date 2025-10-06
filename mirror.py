# /// script
# requires-python = ">=3.12"
# dependencies = [
#     "packaging",
#     "urllib3",
# ]
# ///
import re
import subprocess
from pathlib import Path

import urllib3
from packaging.version import Version


def main():
    # Get current version from README.md
    readme_path = Path(__file__).parent / "README.md"
    readme_content = readme_path.read_text()

    # Extract current version from README.md (looking for version in usage examples)
    version_match = re.search(r"version: '(\d+\.\d+\.\d+)'", readme_content)
    if not version_match:
        raise RuntimeError("Could not find current version in README.md")

    current_version = Version(version_match.group(1))
    print(f"Current version: {current_version}")

    # Get newer versions from PyPI
    resp = urllib3.request("GET", "https://pypi.org/pypi/tombi/json")
    if resp.status != 200:
        raise RuntimeError(
            f"Failed to fetch package information from PyPI. "
            f"Status code: {resp.status} Reason: {resp.reason}"
        )

    versions = [Version(release) for release in resp.json()["releases"]]
    versions = sorted(
        v for v in versions if v > current_version and not v.is_prerelease
    )

    if not versions:
        print("No newer versions found")
        return

    latest_version = versions[-1]
    print(f"Latest version: {latest_version}")

    if latest_version != current_version:
        paths = update_version_in_files(latest_version)

        subprocess.run(["git", "add", *paths], check=True)
        subprocess.run(["git", "commit", "-m", f"Update Tombi version to {latest_version}"], check=True)

        subprocess.run(
            ["git", "push", "origin", "HEAD:refs/heads/main"], check=True
        )


def update_version_in_files(new_version: Version) -> tuple[str, ...]:
    def replace_readme_md(content: str) -> str:
        # Replace version in usage examples
        content = re.sub(r"version: '\d+\.\d+\.\d+'", f"version: '{new_version}'", content)
        content = re.sub(r'e.g., "\d+\.\d+\.\d+", "latest"', f'e.g., "{new_version}", "latest"', content)
        return content

    paths = {
        "README.md": replace_readme_md,
    }
    for path, replacer in paths.items():
        updated_content = replacer(content=Path(path).read_text())
        Path(path).write_text(updated_content)

    return tuple(paths.keys())


if __name__ == "__main__":
    main()
