import argparse
import re
import json
from pathlib import Path

REPO_ROOT = Path(__file__).parent


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


def update_package_json(new_version: str) -> bool:
    package_json_path = REPO_ROOT / "package.json"
    package_json = json.loads(package_json_path.read_text())
    if package_json["version"] == new_version:
        return False

    package_json["version"] = new_version
    package_json_path.write_text(f"{json.dumps(package_json, indent=2)}\n")
    return True


def update_readme(new_version: str) -> bool:
    readme_path = REPO_ROOT / "README.md"
    readme_content = readme_path.read_text()

    version_match = re.search(
        r"uses: tombi-toml/setup-tombi@v(\d+\.\d+\.\d+)", readme_content
    )
    if not version_match:
        raise RuntimeError("Could not find setup-tombi version in README.md")

    current_version = version_match.group(1)
    print(f"Current documented version: {current_version}")
    if current_version == new_version:
        return False

    updated_content = re.sub(
        r"uses: tombi-toml/setup-tombi@v\d+\.\d+\.\d+",
        f"uses: tombi-toml/setup-tombi@v{new_version}",
        readme_content,
    )
    readme_path.write_text(updated_content)
    return True


def main():
    args = parse_args()
    target_version = normalize_version(args.version)
    current_package_version = read_package_version()
    print(f"Current package version: {current_package_version}")
    print(f"Target version: {target_version}")

    package_updated = update_package_json(target_version)
    readme_updated = update_readme(target_version)

    if not package_updated and not readme_updated:
        print("Versions are already up to date")
        return

    if package_updated:
        print("Updated package.json")
    if readme_updated:
        print("Updated README.md")


if __name__ == "__main__":
    main()
