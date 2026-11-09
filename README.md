# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.11.1
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.11.1
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.11.1
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.11.1
  with:
    archive-checksum: '20ad530e4878c8214e40e14e92623fd2ef244254a397a5cab29137f9076c156e'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `c14d4dbe7e0f8887a0090a91362ce3e46aa61002f879ff1728e8607f1c573197` |
| `aarch64-pc-windows-msvc` | `e2f3fe10bd8abab2989a99303ba63c682bba4b8e8c0c121e332b7c45bf37621a` |
| `aarch64-unknown-linux-musl` | `df98bd2067cc97f12e1c92b9a916ed0a6515cda643b31785887c78612fcd15e0` |
| `arm-unknown-linux-gnueabihf` | `c74e0c9aa619af5e720f07354cbadb4fb180dd05722e7c831d1fa8dd0b1e5d5b` |
| `x86_64-apple-darwin` | `3130e3cdae621f09c730a19c725b7302463310fd5868362a7241ff9cdf370251` |
| `x86_64-pc-windows-msvc` | `a12a12dd8cae4199b67b24480f6523859c94e6af1de1f1ef0df81a3da37e4480` |
| `x86_64-unknown-linux-musl` | `20ad530e4878c8214e40e14e92623fd2ef244254a397a5cab29137f9076c156e` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.11.1
  with:
    binary-checksum: 'bbb52aa4adfc3c20a2badf5c3cb24561b760e1a911eabaf35a5ff31d736519ab'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `9f1781562d41cada5097985ac0eb56bebb6e46710273774073ec161e1e667eb5` |
| `aarch64-pc-windows-msvc` | `813b6b312ca85e23a8be118e87871c85f48582253b87547ec1baf73d6467f826` |
| `aarch64-unknown-linux-musl` | `a5c5ca01f963d8375dbeb3588647e3257874324830688bd1a817294e9f5b9e82` |
| `arm-unknown-linux-gnueabihf` | `7fb34cd7d706118b0da18ec2a7b3354f2186ea87ff9eb8cd4b0bf60a6eccd840` |
| `x86_64-apple-darwin` | `b967073cf5e49e49100ae78df1e6751c72d6581b7f186e4d18577601d2237b09` |
| `x86_64-pc-windows-msvc` | `44ba3e4f29e6d7792cc59a9ab3e77d08f60cea2dac1c1292301757ac2b09e0a5` |
| `x86_64-unknown-linux-musl` | `bbb52aa4adfc3c20a2badf5c3cb24561b760e1a911eabaf35a5ff31d736519ab` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.11.1
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.11.1
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
      - uses: tombi-toml/setup-tombi@v1.11.1
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
