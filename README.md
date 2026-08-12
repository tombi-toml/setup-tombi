# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.3.2
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.3.2
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.3.2
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.3.2
  with:
    archive-checksum: '454b12f539c59358d1434dcaa42db17c4335f94d05f2e7fa0848824e67f1ffb1'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `306de2c209031d5bdfff579d87fe78e9a491d4f6c98c088cdbc5a771077e37bc` |
| `aarch64-pc-windows-msvc` | `d2ef402d42d13fe8f27e70b229629f245694667688e25762cbb735ee5ad77a0e` |
| `aarch64-unknown-linux-musl` | `3332fcca7ad38e67993af94e7072f8888f6ee0a5cf2fdb2bf8de5b3596432b09` |
| `arm-unknown-linux-gnueabihf` | `4d419107f9120655403f5e8c281e4e0883d31156b49bcf2b39c45d2a58613587` |
| `x86_64-apple-darwin` | `cb7c250820c49d33ad5b290f6da5215a579120023e66a70da5476bf2d67b34cd` |
| `x86_64-pc-windows-msvc` | `fd6a47ffea392af2df35d3fac6b0f1b3d8256aa084fefd7e1ed8186caa7dad48` |
| `x86_64-unknown-linux-musl` | `454b12f539c59358d1434dcaa42db17c4335f94d05f2e7fa0848824e67f1ffb1` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.3.2
  with:
    binary-checksum: 'd7e5a17b8541cc6f1947160304dbd689709b342a77ba3d2fd68c0b5b239accc6'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `8c420d50c9ee4bbec4717bed7aede4c012cd2f46831c2e4fed22aeca50b35715` |
| `aarch64-pc-windows-msvc` | `020fb8dda864bf11020519adea788457490757afcb54336683855a1618b47359` |
| `aarch64-unknown-linux-musl` | `74bf73e3aebffbb2b87392491398db08a5ba3574738a3689b9e57a3799dde1c4` |
| `arm-unknown-linux-gnueabihf` | `8ea5002694014ca9bbe155e8ba9b7435c555ef7bdd9cb5837b8e0757445c911e` |
| `x86_64-apple-darwin` | `142e3d9d752de2d92fedc508307aef787637f55c098e7b8eb39d3936eb9edbfd` |
| `x86_64-pc-windows-msvc` | `b3d3aae207656d5785194fb63000ab521c53c0f48043b246c2bf9295f752256a` |
| `x86_64-unknown-linux-musl` | `d7e5a17b8541cc6f1947160304dbd689709b342a77ba3d2fd68c0b5b239accc6` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.3.2
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.3.2
  with:
    enable-cache: true
  env:
    TOMBI_CACHE_HOME: ${{ runner.temp }}/tombi-cache
```


## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `version` | Version of Tombi to install (e.g., "1.0.0", "latest"). When omitted, installs the Tombi version that matches the `setup-tombi` release version. Mutually exclusive with `lockfile` | No | `setup-tombi` release version |
| `lockfile` | Path to a lock file used to resolve Tombi version. Supported: `uv.lock`, `poetry.lock`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lock` | No | - |
| `archive-checksum` | SHA256 checksum to validate the downloaded archive before extraction. Accepts `<hex>` or `sha256:<hex>` | No | - |
| `binary-checksum` | SHA256 checksum to validate the installed executable binary. Accepts `<hex>` or `sha256:<hex>` | No | - |
| `checksum` | ⚠️ Deprecated. Alias for `binary-checksum` | No | - |
| `enable-cache` | Persist the Tombi cache using GitHub Actions cache. Supports `true`, `false`, and `auto` | No | `auto` |

## Example workflow

```yaml
name: TOML Validation

on:
  push:
    paths:
      - '**.toml'
  pull_request:
    paths:
      - '**.toml'

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: tombi-toml/setup-tombi@v1.3.2
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
