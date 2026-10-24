# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.3
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.3
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.3
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.3
  with:
    archive-checksum: 'c24d10ba5fc8c28e04e3d1bb726d752ac492e1c980ad357a8ca28c8027a52db8'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `a316556e1582463288639470ff0a1acc36d3d73bd0649acd21af994b87c14670` |
| `aarch64-pc-windows-msvc` | `ece01ea8d27e4a05ad72ea3c64d13f560e610cbc0085b33c1dbc5884a87d34be` |
| `aarch64-unknown-linux-musl` | `108df6f11754397eb4ce71f3ccf22dc5a6b0fe63b97fd1c31237db7497d16610` |
| `arm-unknown-linux-gnueabihf` | `39bf56531c7b96a6e0d8233cb1e4add11631a982f9c77f7f430d60a6789f6d22` |
| `x86_64-apple-darwin` | `8d72e8009f00a653f927ddc9e1e2cff4d1bdd48dff167e53513fa4923f54410f` |
| `x86_64-pc-windows-msvc` | `fbb954dae999af20da0e32bf33685cff7e18ddaab036f4cb49cb63631ad31435` |
| `x86_64-unknown-linux-musl` | `c24d10ba5fc8c28e04e3d1bb726d752ac492e1c980ad357a8ca28c8027a52db8` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.3
  with:
    binary-checksum: 'e78e89747e6c80e6dda7e4bcb1c5014f23b8b55425d8a37ea1c8ba404f9764f4'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `9aa820464391c789c5e94783b13a15f06cd60df7cf1021e4b940e5c77224178d` |
| `aarch64-pc-windows-msvc` | `f34a862433e2dd98b4238ccf458cefea31470a45db9a53d2c6c0146a7a06e179` |
| `aarch64-unknown-linux-musl` | `3111c0e8726800b601b0196ac2e39932197f186726c86080d6c2e45969b54f80` |
| `arm-unknown-linux-gnueabihf` | `c64e1dd7cd034fa3c12ce3050f1aa08a6ff38b708cfdd0ea5a21213ec98a4da6` |
| `x86_64-apple-darwin` | `366dd39d6d64af6bc5440c6ad5a10831fa0c2ed3ba32ff25714e2d4f0bc85527` |
| `x86_64-pc-windows-msvc` | `11d3b9fe1f57deeeb1e380e8596e484708323c652520dafc63373bfbd647e45d` |
| `x86_64-unknown-linux-musl` | `e78e89747e6c80e6dda7e4bcb1c5014f23b8b55425d8a37ea1c8ba404f9764f4` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.3
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.3
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
      - uses: tombi-toml/setup-tombi@v1.9.3
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
