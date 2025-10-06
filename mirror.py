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

    print(f"Versions to mirror: {versions}")
    for i, version in enumerate(versions):
        tag_name = f"v{version}"
        paths = update_version_in_files(version)

        subprocess.run(["git", "add", *paths], check=True)
        subprocess.run(["git", "commit", "-m", f"Update Tombi to {tag_name}"], check=True)

        subprocess.run(["git", "tag", tag_name], check=True)
        subprocess.run(
            ["git", "push", "origin", "HEAD:refs/heads/main", "--tags"], check=True
        )

        gh_release_cmd = [
            "gh",
            "release",
            "create",
            tag_name,
            "--title",
            tag_name,
            "--notes",
            f"Update Tombi to {tag_name}\n\nSee: https://github.com/tombi-toml/tombi/releases/tag/{tag_name}",
            "--verify-tag",
        ]
        if i == len(versions) - 1:
            gh_release_cmd.append("--latest")
        subprocess.run(gh_release_cmd, check=True)


def update_version_in_files(version: Version) -> tuple[str, ...]:
    def replace_readme_md(content: str) -> str:
        # Replace version in usage examples
        content = re.sub(r"version: '\d+\.\d+\.\d+'", f"version: '{version}'", content)
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
