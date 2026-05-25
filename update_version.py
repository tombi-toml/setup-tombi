import re
import subprocess
import json
from pathlib import Path


def main():
    package_json_path = Path(__file__).parent / "package.json"
    package_version = json.loads(package_json_path.read_text())["version"]

    readme_path = Path(__file__).parent / "README.md"
    readme_content = readme_path.read_text()
    version_match = re.search(
        r"uses: tombi-toml/setup-tombi@v(\d+\.\d+\.\d+)", readme_content
    )
    if not version_match:
        raise RuntimeError("Could not find setup-tombi version in README.md")

    current_version = version_match.group(1)
    print(f"Current documented version: {current_version}")
    print(f"Package version: {package_version}")
    if package_version == current_version:
        print("Versions are already up to date")
        return

    paths = update_version_in_files(package_version)
    subprocess.run(["git", "add", *paths], check=True)
    subprocess.run(
        ["git", "commit", "-m", f"Update version to v{package_version}"],
        check=True,
    )
    subprocess.run(["git", "push", "origin", "HEAD:refs/heads/main"], check=True)


def update_version_in_files(new_version: str) -> tuple[str, ...]:
    def replace_readme_md(content: str) -> str:
        content = re.sub(
            r"uses: tombi-toml/setup-tombi@v\d+\.\d+\.\d+",
            f"uses: tombi-toml/setup-tombi@v{new_version}",
            content,
        )
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
