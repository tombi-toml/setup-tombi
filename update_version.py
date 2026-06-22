import json
import argparse
import hashlib
import io
import re
import tarfile
import urllib.request
import zipfile
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).parent
DEFAULT_CHECKSUM_TARGET = "x86_64-unknown-linux-musl"
CHECKSUM_TARGETS = (
    ("aarch64-apple-darwin", "tar.gz", "tombi"),
    ("aarch64-pc-windows-msvc", "zip", "tombi.exe"),
    ("aarch64-unknown-linux-musl", "tar.gz", "tombi"),
    ("arm-unknown-linux-gnueabihf", "tar.gz", "tombi"),
    ("x86_64-apple-darwin", "tar.gz", "tombi"),
    ("x86_64-pc-windows-msvc", "zip", "tombi.exe"),
    ("x86_64-unknown-linux-musl", "tar.gz", "tombi"),
)


@dataclass(frozen=True)
class ReleaseChecksums:
    target: str
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
    normalized_version = version.removeprefix("v").strip()
    if not re.fullmatch(r"\d+\.\d+\.\d+", normalized_version):
        raise RuntimeError(
            "Version must be a semantic version in MAJOR.MINOR.PATCH format"
        )
    return normalized_version


def read_package_version() -> str:
    package_json_path = REPO_ROOT / "package.json"
    return json.loads(package_json_path.read_text())["version"]


def sha256_hex(content: bytes) -> str:
    return hashlib.sha256(content).hexdigest()


def find_binary_in_tar_gz(archive_content: bytes, binary_name: str) -> bytes:
    with tarfile.open(fileobj=io.BytesIO(archive_content), mode="r:gz") as archive:
        for member in archive.getmembers():
            if not member.isfile() or Path(member.name).name != binary_name:
                continue

            binary_file = archive.extractfile(member)
            if binary_file is None:
                continue

            with binary_file:
                return binary_file.read()

    raise RuntimeError(f"Could not find {binary_name} in release archive")


def find_binary_in_zip(archive_content: bytes, binary_name: str) -> bytes:
    with zipfile.ZipFile(io.BytesIO(archive_content)) as archive:
        for member_name in archive.namelist():
            if Path(member_name).name != binary_name:
                continue
            return archive.read(member_name)

    raise RuntimeError(f"Could not find {binary_name} in release archive")


def find_binary_in_archive(
    archive_content: bytes,
    archive_format: str,
    binary_name: str,
) -> bytes:
    if archive_format == "tar.gz":
        return find_binary_in_tar_gz(archive_content, binary_name)
    if archive_format == "zip":
        return find_binary_in_zip(archive_content, binary_name)

    raise RuntimeError(f"Unsupported archive format: {archive_format}")


def fetch_release_checksums_for_target(
    version: str,
    target: str,
    archive_format: str,
    binary_name: str,
) -> ReleaseChecksums:
    archive_name = f"tombi-cli-{version}-{target}.{archive_format}"
    archive_url = (
        f"https://github.com/tombi-toml/tombi/releases/download/v{version}/{archive_name}"
    )

    print(f"Downloading {archive_url}")
    with urllib.request.urlopen(archive_url, timeout=60) as response:
        archive_content = response.read()

    binary_content = find_binary_in_archive(
        archive_content,
        archive_format,
        binary_name,
    )
    return ReleaseChecksums(
        target=target,
        archive=sha256_hex(archive_content),
        binary=sha256_hex(binary_content),
    )


def fetch_release_checksums(version: str) -> list[ReleaseChecksums]:
    return [
        fetch_release_checksums_for_target(version, target, archive_format, binary_name)
        for target, archive_format, binary_name in CHECKSUM_TARGETS
    ]


def default_release_checksums(checksums: list[ReleaseChecksums]) -> ReleaseChecksums:
    for checksum in checksums:
        if checksum.target == DEFAULT_CHECKSUM_TARGET:
            return checksum

    raise RuntimeError(f"Could not find checksums for {DEFAULT_CHECKSUM_TARGET}")


def render_checksum_table(
    checksums: list[ReleaseChecksums],
    checksum_field: str,
    checksum_label: str,
) -> str:
    rows = [
        f"| Target | {checksum_label} |",
        "|--------|----------|",
    ]
    for checksum in checksums:
        value = getattr(checksum, checksum_field)
        rows.append(f"| `{checksum.target}` | `{value}` |")
    return "\n".join(rows)


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


def readme_needs_update(new_version: str) -> bool:
    readme_path = REPO_ROOT / "README.md"
    readme_content = readme_path.read_text()

    if re.search(
        r"uses: tombi-toml/setup-tombi@v(?!"
        + re.escape(new_version)
        + r"\b)\d+\.\d+\.\d+",
        readme_content,
    ):
        return True

    stale_patterns = (
        r"archive-checksum: '<sha256-checksum>'",
        r"binary-checksum: '<sha256-checksum>'",
        r"(?m)^    version: '[^']+'\n    archive-checksum:",
        r"(?m)^    version: '[^']+'\n    binary-checksum:",
        r"<summary>Checksums for all supported targets</summary>",
        r"<summary>Archive checksums for all supported targets</summary>",
        r"<summary>Executable binary checksums for all supported targets</summary>",
    )
    if any(re.search(pattern, readme_content) for pattern in stale_patterns):
        return True

    required_patterns = (
        r"<summary>🔐 Archive checksums for all supported targets</summary>",
        r"<summary>🔐 Executable binary checksums for all supported targets</summary>",
        r"archive-checksum: '[0-9a-f]{64}'",
        r"binary-checksum: '[0-9a-f]{64}'",
    )
    return not all(re.search(pattern, readme_content) for pattern in required_patterns)


def update_readme(new_version: str, checksums: list[ReleaseChecksums]) -> bool:
    readme_path = REPO_ROOT / "README.md"
    readme_content = readme_path.read_text()
    default_checksums = default_release_checksums(checksums)

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
        f"    archive-checksum: '{default_checksums.archive}'",
        updated_content,
    )
    if archive_replacements != 1:
        raise RuntimeError("Could not update archive-checksum example in README.md")

    updated_content, binary_replacements = re.subn(
        r"(?m)^(?:    version: '[^']+'\n)?    binary-checksum: '[^']+'$",
        f"    binary-checksum: '{default_checksums.binary}'",
        updated_content,
    )
    if binary_replacements != 1:
        raise RuntimeError("Could not update binary-checksum example in README.md")

    archive_details = (
        "<details>\n"
        "<summary>🔐 Archive checksums for all supported targets</summary>\n\n"
        f"{render_checksum_table(checksums, 'archive', 'Archive checksum')}\n\n"
        "</details>\n"
    )
    binary_details = (
        "<details>\n"
        "<summary>🔐 Executable binary checksums for all supported targets</summary>\n\n"
        f"{render_checksum_table(checksums, 'binary', 'Binary checksum')}\n\n"
        "</details>\n"
    )

    legacy_details_pattern = (
        r"\n<details>\n"
        r"<summary>Checksums for all supported targets</summary>\n\n"
        r"(?s:.*?)\n"
        r"</details>\n*"
    )
    updated_content = re.sub(
        legacy_details_pattern,
        "\n",
        updated_content,
    )

    archive_details_pattern = (
        r"(?s)\n<details>\n"
        r"<summary>(?:🔐 )?Archive checksums for all supported targets</summary>\n\n"
        r".*?\n"
        r"</details>\n*"
    )
    updated_content = re.sub(archive_details_pattern, "\n", updated_content)

    binary_details_pattern = (
        r"(?s)\n<details>\n"
        r"<summary>(?:🔐 )?Executable binary checksums for all supported targets</summary>\n\n"
        r".*?\n"
        r"</details>\n*"
    )
    updated_content = re.sub(binary_details_pattern, "\n", updated_content)

    archive_insert_after = (
        r"(?s)(For the archive\n\n"
        r"```yaml\n"
        r"- uses: tombi-toml/setup-tombi@v\d+\.\d+\.\d+\n"
        r"  with:\n"
        r"    archive-checksum: '[^']+'\n"
        r"```\n)"
    )
    updated_content, archive_details_replacements = re.subn(
        archive_insert_after,
        rf"\1\n{archive_details}",
        updated_content,
        count=1,
    )
    if archive_details_replacements != 1:
        raise RuntimeError("Could not update archive checksum details in README.md")

    binary_insert_after = (
        r"(?s)(For the executable binary\n\n"
        r"```yaml\n"
        r"- uses: tombi-toml/setup-tombi@v\d+\.\d+\.\d+\n"
        r"  with:\n"
        r"    binary-checksum: '[^']+'\n"
        r"```\n)"
    )
    updated_content, binary_details_replacements = re.subn(
        binary_insert_after,
        rf"\1\n{binary_details}",
        updated_content,
        count=1,
    )
    if binary_details_replacements != 1:
        raise RuntimeError("Could not update binary checksum details in README.md")

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

    package_needs_update = current_package_version != target_version
    readme_requires_update = readme_needs_update(target_version)
    if not package_needs_update and not readme_requires_update:
        print("Versions are already up to date")
        return

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
