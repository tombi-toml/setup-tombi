import json
import argparse
import hashlib
import io
import re
import tarfile
import urllib.request
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).parent
CHECKSUM_TARGET = "x86_64-unknown-linux-musl"


@dataclass(frozen=True)
class ReleaseChecksums:
    archive: str
    binary: str


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--version",
        required=True,
        help="Version to sync into package.json and README.md. Accepts both 1.2.3 and v1.2.3.",
    )
    return parser.parse_args()


def normalize_version(version: str) -> str:
    return version.removeprefix("v").strip()


def read_package_version() -> str:
    package_json_path = REPO_ROOT / "package.json"
    return json.loads(package_json_path.read_text())["version"]


def sha256_hex(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def find_binary_in_tar_gz(archive_content: bytes) -> bytes:
    with tarfile.open(fileobj=io.BytesIO(archive_content), mode="r:gz") as archive:
        for member in archive.getmembers():
            if not member.isfile() or Path(member.name).name != "tombi":
                continue

            binary_file = archive.extractfile(member)
            if binary_file is None:
                break
            return binary_file.read()

    raise RuntimeError("Could not find tombi binary in release archive")


def fetch_release_checksums(version: str) -> ReleaseChecksums:
    archive_name = f"tombi-cli-{version}-{CHECKSUM_TARGET}.tar.gz"
    archive_url = (
        f"https://github.com/tombi-toml/tombi/releases/download/v{version}/{archive_name}"
    )

    print(f"Downloading {archive_url}")
    with urllib.request.urlopen(archive_url, timeout=60) as response:
        archive_content = response.read()

    binary_content = find_binary_in_tar_gz(archive_content)
    return ReleaseChecksums(
        archive=sha256_hex(archive_content),
        binary=sha256_hex(binary_content),
    )


def update_package_json(new_version: str) -> bool:
    package_json_path = REPO_ROOT / "package.json"
    package_json_content = package_json_path.read_text()
    package_json = json.loads(package_json_content)
    current_version = package_json["version"]
    if current_version == new_version:
        return False

    updated_content, replacements = re.subn(
        r'("version"\s*:\s*")[^"]+(")',
        rf"\g<1>{new_version}\g<2>",
        package_json_content,
        count=1,
    )
    if replacements != 1:
        raise RuntimeError('Could not find "version" field in package.json')

    package_json_path.write_text(updated_content)
    return True


def update_readme(new_version: str, checksums: ReleaseChecksums) -> bool:
    readme_path = REPO_ROOT / "README.md"
    readme_content = readme_path.read_text()

    version_match = re.search(
        r"uses: tombi-toml/setup-tombi@v(\d+\.\d+\.\d+)", readme_content
    )
    if not version_match:
        raise RuntimeError("Could not find setup-tombi version in README.md")

    current_version = version_match.group(1)
    print(f"Current documented version: {current_version}")

    updated_content, replacements = re.subn(
        r"uses: tombi-toml/setup-tombi@v\d+\.\d+\.\d+",
        f"uses: tombi-toml/setup-tombi@v{new_version}",
        readme_content,
    )
    if replacements == 0:
        raise RuntimeError("Could not find setup-tombi version references in README.md")

    updated_content, archive_replacements = re.subn(
        r"(?m)^(?:    version: '[^']+'\n)?    archive-checksum: '[^']+'$",
        f"    archive-checksum: '{checksums.archive}'",
        updated_content,
    )
    if archive_replacements != 1:
        raise RuntimeError("Could not update archive-checksum example in README.md")

    updated_content, binary_replacements = re.subn(
        r"(?m)^(?:    version: '[^']+'\n)?    binary-checksum: '[^']+'$",
        f"    binary-checksum: '{checksums.binary}'",
        updated_content,
    )
    if binary_replacements != 1:
        raise RuntimeError("Could not update binary-checksum example in README.md")

    if updated_content == readme_content:
        return False

    readme_path.write_text(updated_content)
    return True


def main():
    args = parse_args()
    target_version = normalize_version(args.version)
    current_package_version = read_package_version()
    print(f"Current package version: {current_package_version}")
    print(f"Target version: {target_version}")

    checksums = fetch_release_checksums(target_version)
    package_updated = update_package_json(target_version)
    readme_updated = update_readme(target_version, checksums)

    if not package_updated and not readme_updated:
        print("Versions are already up to date")
        return

    if package_updated:
        print("Updated package.json")
    if readme_updated:
        print("Updated README.md")


if __name__ == "__main__":
    main()
