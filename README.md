# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.8
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.8
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.8
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.8
  with:
    archive-checksum: '27879624028c0e137978d97a5d6e4da121e993ae295c45e868b9b4612b9ccc15'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `7730b6eda7684715e74cf0bc1395407da2c494e497f059a6cdcae04d19bbeadf` |
| `aarch64-pc-windows-msvc` | `ad16a88e53de0283ceaf33888e4db8a4df9e78853caa59008bfeedf88adf238e` |
| `aarch64-unknown-linux-musl` | `33db6011e191f5c51a89631a714a33fcee883ef32c8d36e63a8b890e1c2e30ec` |
| `arm-unknown-linux-gnueabihf` | `8ccb499bb2fdd2faa432ad338a56c808515a05c6aecbcc773067a59752390cfc` |
| `x86_64-apple-darwin` | `478bf951f7987c3eb4749a1d686152a76ea3b2673e344ea1ceaa557e8152edd6` |
| `x86_64-pc-windows-msvc` | `ef34c217aecec5f384c259cea958e02e83b46fdf404ecd5dbd55ee8833bc5265` |
| `x86_64-unknown-linux-musl` | `27879624028c0e137978d97a5d6e4da121e993ae295c45e868b9b4612b9ccc15` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.8
  with:
    binary-checksum: '1387456284e04e1ad8cb2aa2e856628a966c1fe49b5388cf028685dfb35c8461'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `6ff8d3d565a88b0ef83553631bd9d159ab673735471d09d181e0fbdcaa58270d` |
| `aarch64-pc-windows-msvc` | `27fb5d6fe45fdb5555f3cd64ee43d3194b4c20eaf8525eca4ed71407eecc01d7` |
| `aarch64-unknown-linux-musl` | `494431c1cacb4bffd5337f9f3a9097be3715668be38c867f8c8c990f622ca7f2` |
| `arm-unknown-linux-gnueabihf` | `b7342cd8014dab28424194b2cd4e3c9d9cbb61fcc6ac63f558bf17f56e8db3d0` |
| `x86_64-apple-darwin` | `a67deaf7185664a6023dadf86e3a34c820fa1b95cb82960a88124b7a9c7aba74` |
| `x86_64-pc-windows-msvc` | `af2be47361373f8b03ce709660c26b51d00cd0dea6ef4153869bfa3a6a2f9469` |
| `x86_64-unknown-linux-musl` | `1387456284e04e1ad8cb2aa2e856628a966c1fe49b5388cf028685dfb35c8461` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.8
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.8
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
      - uses: tombi-toml/setup-tombi@v1.8.8
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
