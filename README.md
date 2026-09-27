# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.6
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.6
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.6
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.6
  with:
    archive-checksum: '18f155dbaf9d097932697673843d146ba4557fb89a52a89e51c66a90b490ef6a'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `9614cd807bf26a624994643b86dc76d0251cea2f8bac703c4f61803f171c7eb2` |
| `aarch64-pc-windows-msvc` | `2cae2145cef4a0e8ac85f57718284f14629efe2209a94ce7aa99d3705fa2c765` |
| `aarch64-unknown-linux-musl` | `6503f5f3b17da4881991b14299333502ac2a9e844a393b98bcc1985122118b26` |
| `arm-unknown-linux-gnueabihf` | `359d994312402a6bcca4183c2df68887c9e1f7586bb71846e9930879079d8761` |
| `x86_64-apple-darwin` | `c827db5a15ac8d1108ae48c8bcce00b3cea529d709b9f5743f3d2afc909cf561` |
| `x86_64-pc-windows-msvc` | `fb5c1dcb0ec68ea766da3ea5cf6279389319e99d4a32437f72db4749c99dd6dc` |
| `x86_64-unknown-linux-musl` | `18f155dbaf9d097932697673843d146ba4557fb89a52a89e51c66a90b490ef6a` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.6
  with:
    binary-checksum: '646bded635932a9a48a840a7712f87954b0284a66f2a7e73b90bf38ba6707229'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `15f38964bdb62aacc88402372d1204f68d07a27b30ff9c2ffc5426ead0e701ec` |
| `aarch64-pc-windows-msvc` | `f66893dd6d1be7147e2a9a39ab8567fd65c64356315714294f19172005433327` |
| `aarch64-unknown-linux-musl` | `67b7705e7e2465919fda5e9bf59100b2f69edc2c01df7f6524616b14ccd233a6` |
| `arm-unknown-linux-gnueabihf` | `51bcb299892d5d303a8683a5eee37614f6c51a46097beeefcd2a427f0969772a` |
| `x86_64-apple-darwin` | `8b7f05286e76e3f990ea348775804b7c3f291becc5fd65aa6f0729bfc1c811f1` |
| `x86_64-pc-windows-msvc` | `d39df391f59aecb6231d6b4722cc5fabbdf5af8f1a873eed3956a98e29410d0e` |
| `x86_64-unknown-linux-musl` | `646bded635932a9a48a840a7712f87954b0284a66f2a7e73b90bf38ba6707229` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.6
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.6
  with:
    enable-cache: true
  env:
    TOMBI_CACHE_HOME: ${{ runner.temp }}/tombi-cache
```


## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `version` | Version of Tombi to install (e.g., "1.0.0", "latest"). When omitted, installs the Tombi version that matches the `setup-tombi` release version. Mutually exclusive with `lockfile` | No | `setup-tombi` release version |
| `lockfile` | Path to a lock file used to resolve Tombi version. Supported: `uv.lock`, `poetry.lock`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lock`, `mise.lock` | No | - |
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
      - uses: tombi-toml/setup-tombi@v1.5.6
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
