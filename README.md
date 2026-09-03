# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.1
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.1
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.1
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.1
  with:
    archive-checksum: 'f3f599f4fdb2e5a62b7bb716e9b840b03d4127323014a48785c466901e0a3f5b'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `77a48fa3c5774eb48f42b8c16265201bb92a5948e06357da9d9a335a116b684b` |
| `aarch64-pc-windows-msvc` | `bbde63c13145c268e25eb295efcc78de9ee57579052d3ecd46e32e7e78d938c6` |
| `aarch64-unknown-linux-musl` | `3512b6fc916d3c56758c230cfd941df2498b8601e011fe52327acea9a7271a63` |
| `arm-unknown-linux-gnueabihf` | `2ec5c592e1ce9582d32fe34ea24a5ea10485efa0ddd68b0b072394970b71bb98` |
| `x86_64-apple-darwin` | `c6d04a64e8e2d5f984d65957eff748ef659b3a5899cf5224e76c26a8c648ae9d` |
| `x86_64-pc-windows-msvc` | `7a534e1def6b9d081de5f168dad0e10fe39356de8e83597e2c7e82da902eafe3` |
| `x86_64-unknown-linux-musl` | `f3f599f4fdb2e5a62b7bb716e9b840b03d4127323014a48785c466901e0a3f5b` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.1
  with:
    binary-checksum: '456c2956d9226126faf5e60131a05b059a8818d5bb3f51e04546088b290a5d23'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `64314e5ad0bd6aad09f75eb24bebf6536397c53425a9fdbd43134f7eb5a880d1` |
| `aarch64-pc-windows-msvc` | `0089967d71a1401ee2aeea09c91ac5228a0619dc312f9109795ee757ff9cd2a2` |
| `aarch64-unknown-linux-musl` | `027c8c8d90f2daef0a19acd7cdbd41b10e92874ebb5cfcd60524a1fdf8f56f80` |
| `arm-unknown-linux-gnueabihf` | `51f434a2abe67652e391d1178d19e0a582b739c5e809ed6fdbd02df07a26c03d` |
| `x86_64-apple-darwin` | `a463782adf73eec8fa7781d02d1cb329c4167f8ce219ab511afc8aeea834fd70` |
| `x86_64-pc-windows-msvc` | `e9a76e619d4c5436bf13afbd9819b562bf0df74ecc16cd079dfc97fdcae7c43a` |
| `x86_64-unknown-linux-musl` | `456c2956d9226126faf5e60131a05b059a8818d5bb3f51e04546088b290a5d23` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.1
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.1
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
      - uses: tombi-toml/setup-tombi@v1.5.1
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
