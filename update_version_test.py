import io
import tarfile
import tempfile
import unittest
import zipfile
from pathlib import Path

import update_version


class UpdateVersionTest(unittest.TestCase):
    def test_find_binary_in_tar_gz(self):
        archive_buffer = io.BytesIO()
        with tarfile.open(fileobj=archive_buffer, mode="w:gz") as archive:
            binary_content = b"binary content"
            member = tarfile.TarInfo("tombi-cli-1.2.3-x86_64-unknown-linux-musl/tombi")
            member.size = len(binary_content)
            archive.addfile(member, io.BytesIO(binary_content))

        self.assertEqual(
            update_version.find_binary_in_tar_gz(archive_buffer.getvalue(), "tombi"),
            binary_content,
        )

    def test_find_binary_in_zip(self):
        archive_buffer = io.BytesIO()
        with zipfile.ZipFile(archive_buffer, mode="w") as archive:
            archive.writestr(
                "tombi-cli-1.2.3-x86_64-pc-windows-msvc/tombi.exe",
                b"windows binary content",
            )

        self.assertEqual(
            update_version.find_binary_in_zip(archive_buffer.getvalue(), "tombi.exe"),
            b"windows binary content",
        )

    def test_update_readme_replaces_versions_and_checksum_placeholders(self):
        with tempfile.TemporaryDirectory() as directory:
            original_repo_root = update_version.REPO_ROOT
            try:
                update_version.REPO_ROOT = Path(directory)
                readme_path = update_version.REPO_ROOT / "README.md"
                readme_path.write_text(
                    """# setup-tombi

```yaml
- uses: tombi-toml/setup-tombi@v1.1.4
  with:
    version: '1.0.0'
    archive-checksum: '<sha256-checksum>'
```

```yaml
- uses: tombi-toml/setup-tombi@v1.1.4
  with:
    version: '1.0.0'
    binary-checksum: '<sha256-checksum>'
```
"""
                )

                updated = update_version.update_readme(
                    "1.2.3",
                    [
                        update_version.ReleaseChecksums(
                            target="aarch64-apple-darwin",
                            archive="darwin-arm64-archive-sha",
                            binary="darwin-arm64-binary-sha",
                        ),
                        update_version.ReleaseChecksums(
                            target="x86_64-unknown-linux-musl",
                            archive="archive-sha",
                            binary="binary-sha",
                        ),
                    ],
                )

                self.assertTrue(updated)
                self.assertEqual(
                    readme_path.read_text(),
                    """# setup-tombi

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    archive-checksum: 'archive-sha'
```

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    binary-checksum: 'binary-sha'
```

<details>
<summary>Checksums for all supported targets</summary>

| Target | Archive checksum | Binary checksum |
|--------|------------------|-----------------|
| `aarch64-apple-darwin` | `darwin-arm64-archive-sha` | `darwin-arm64-binary-sha` |
| `x86_64-unknown-linux-musl` | `archive-sha` | `binary-sha` |

</details>
""",
                )
            finally:
                update_version.REPO_ROOT = original_repo_root

    def test_update_readme_updates_existing_checksum_examples(self):
        with tempfile.TemporaryDirectory() as directory:
            original_repo_root = update_version.REPO_ROOT
            try:
                update_version.REPO_ROOT = Path(directory)
                readme_path = update_version.REPO_ROOT / "README.md"
                readme_path.write_text(
                    """# setup-tombi

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    archive-checksum: 'old-archive-sha'
```

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    binary-checksum: 'old-binary-sha'
```

<details>
<summary>Checksums for all supported targets</summary>

| Target | Archive checksum | Binary checksum |
|--------|------------------|-----------------|
| `x86_64-unknown-linux-musl` | `old-archive-sha` | `old-binary-sha` |

</details>
"""
                )

                updated = update_version.update_readme(
                    "1.2.4",
                    [
                        update_version.ReleaseChecksums(
                            target="aarch64-pc-windows-msvc",
                            archive="windows-arm64-archive-sha",
                            binary="windows-arm64-binary-sha",
                        ),
                        update_version.ReleaseChecksums(
                            target="x86_64-unknown-linux-musl",
                            archive="new-archive-sha",
                            binary="new-binary-sha",
                        ),
                    ],
                )

                self.assertTrue(updated)
                self.assertIn(
                    "archive-checksum: 'new-archive-sha'",
                    readme_path.read_text(),
                )
                self.assertIn(
                    "binary-checksum: 'new-binary-sha'",
                    readme_path.read_text(),
                )
                self.assertIn(
                    "| `aarch64-pc-windows-msvc` | `windows-arm64-archive-sha` | `windows-arm64-binary-sha` |",
                    readme_path.read_text(),
                )
                self.assertNotIn("version:", readme_path.read_text())
            finally:
                update_version.REPO_ROOT = original_repo_root


if __name__ == "__main__":
    unittest.main()
