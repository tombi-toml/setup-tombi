# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.7.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.7.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.7.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.7.0
  with:
    archive-checksum: '3dbddb32f38692a60e2dfc5b84e76cedae8aab5f5fcbd3f0cea7cf80fc075f6d'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `ff18e589f45780ebf77637d88f51d3e075b2500cc0bff99f477a79cf49d5ef95` |
| `aarch64-pc-windows-msvc` | `d1883c1d1167f823cc7c91bde2e41df3da24016f5e9c4ba37ca6e96798eba01f` |
| `aarch64-unknown-linux-musl` | `1367ac39bfaaca364c2a69bf0181fa279d6f71ebf48d01684c5c02fd9e421475` |
| `arm-unknown-linux-gnueabihf` | `0ed039d7ba21f75da8e783d71a7f89e89eebbd7956f2d059edda2724e95037ba` |
| `x86_64-apple-darwin` | `6d0f37f27282fa5f1551256f1d00c58cb0e61c443d89b5813c8be6223b73ce37` |
| `x86_64-pc-windows-msvc` | `13822150c15d37a76c989bb7b8f1e6433625b4e72a21dcab10b03d5d46386950` |
| `x86_64-unknown-linux-musl` | `3dbddb32f38692a60e2dfc5b84e76cedae8aab5f5fcbd3f0cea7cf80fc075f6d` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.7.0
  with:
    binary-checksum: 'dc55404a123c9bb30ec7df1896059858597051ae8cdda3b3730c6c17aed624f8'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `5e3ae025a9eb6188443b2edb44850bfe7a401ae5462343335bfc8d34ab8dbef5` |
| `aarch64-pc-windows-msvc` | `ccde80e4cdde04363db320fe441a8852317394043fff289964e7d85e2f58fa2b` |
| `aarch64-unknown-linux-musl` | `3ed2313520ecc94d87cf07f19357823c60410d56b63c1955146707f95cbb7ef3` |
| `arm-unknown-linux-gnueabihf` | `7b2dbb455c9ff38a1d32685e9aeba1804851797b26f1d26f680826681fb6fa75` |
| `x86_64-apple-darwin` | `3978104e533840438782c3b84349d2704d4669368660f04af27098d5730bd411` |
| `x86_64-pc-windows-msvc` | `160fa98d9e1ab93e8a53eb2831b7e085efd2d1d16180304c582ee7244bdcdd6f` |
| `x86_64-unknown-linux-musl` | `dc55404a123c9bb30ec7df1896059858597051ae8cdda3b3730c6c17aed624f8` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.7.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.7.0
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
      - uses: tombi-toml/setup-tombi@v1.7.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
