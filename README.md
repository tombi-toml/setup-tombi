# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.7.3
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.7.3
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.7.3
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.7.3
  with:
    archive-checksum: '90aa18e34c5133879942272fda31677d78dd4221ce8eb06e991c487893aaaba4'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `ff9b64bf45e9cd0881119567f604163212788d6f1a9aba9178f656b49295e97a` |
| `aarch64-pc-windows-msvc` | `7c20cd9529bc937926a281296166b6e92be9ed11dbca3940f41b4ce5da549490` |
| `aarch64-unknown-linux-musl` | `20bd2470c3de95eff95445466bd2e982c6e0920c5dbd0a618ac06c9a64b4dda9` |
| `arm-unknown-linux-gnueabihf` | `e573bf42812af1498a428302ed8b9418e2c3e80d45f9fe705bd5ae74b839f271` |
| `x86_64-apple-darwin` | `ae3c9799acf5e5068e48b87bc486803091b8eb49efa60e480c65568496221a88` |
| `x86_64-pc-windows-msvc` | `6f72039120a4b0b2821a032a1ea6c98b502d2568a650b5cdb106abd67a187478` |
| `x86_64-unknown-linux-musl` | `90aa18e34c5133879942272fda31677d78dd4221ce8eb06e991c487893aaaba4` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.7.3
  with:
    binary-checksum: 'dbf36e6492cc1709e222e5f699291331d857da5ad606b612f5674f5b25a42acb'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `eb410e9db759fee2c8eceb332a984f2b6c25dd1ca83d7cec7920f80e118bf915` |
| `aarch64-pc-windows-msvc` | `fbf0cfa3b909837f69f6fdc8dba1baeca8c80148de6b3acd1b41dbce94f13d4f` |
| `aarch64-unknown-linux-musl` | `0af18ee5318b704c6d622af7f37e2cddbf9930f95209631036f98643f737486b` |
| `arm-unknown-linux-gnueabihf` | `934d7bde49b395380b938c3e52c266dff318ea19033a7d4f1a058e618d311c18` |
| `x86_64-apple-darwin` | `5167b66ec84c74381ec0602db99d6149d028717356b9ff83929ba812477b238b` |
| `x86_64-pc-windows-msvc` | `85e236b1571929347e4a20e04e02849696c40e3c9c743e82e36ad36046d319b6` |
| `x86_64-unknown-linux-musl` | `dbf36e6492cc1709e222e5f699291331d857da5ad606b612f5674f5b25a42acb` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.7.3
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.7.3
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
      - uses: tombi-toml/setup-tombi@v1.7.3
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
