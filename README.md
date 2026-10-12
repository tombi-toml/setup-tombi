# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.3
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.3
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.3
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.3
  with:
    archive-checksum: '659e05345d807f10093e82e20e65ed69c2334c10602df46fac0e1583c43419dd'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `897c2d2d369b09fa536acaf8ea70fbd9758e71a1d78804aef85f9abd955ac7bb` |
| `aarch64-pc-windows-msvc` | `df592b78671e90edb3ada2af448166b0a7fa9465761f4f75ff5e671f1af91d39` |
| `aarch64-unknown-linux-musl` | `2ca3b8b1389d5be1ce51b92f8646fd33ae2465c0ba59d00506bd5b5c77121044` |
| `arm-unknown-linux-gnueabihf` | `06aeccbe31af94f252cb2ade2752e4382a986bb4ed2e2909f17ebf03eccb9c7e` |
| `x86_64-apple-darwin` | `28cdb574f3069e9a8b4aca8255008156e86de434b4ea882546b772d329c67427` |
| `x86_64-pc-windows-msvc` | `c62a90a60202deeef73f3bb6ea9590228ce62e2a6f6b91a374042bbafbcfa2f4` |
| `x86_64-unknown-linux-musl` | `659e05345d807f10093e82e20e65ed69c2334c10602df46fac0e1583c43419dd` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.3
  with:
    binary-checksum: '10de18185747702860fc9894bbd84247a371b0cbb5bf86f73ca872b54f83f133'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `31bf7d0e260216a82b0dff8cdb196d1617c73de5a20df9b38350ded555b4d700` |
| `aarch64-pc-windows-msvc` | `57b49e0aa110a5010a95147bac47c369bd3055613e7efa6dbd2f71d611874343` |
| `aarch64-unknown-linux-musl` | `709e45b1065948cebba3c462ada7a406726b61056477ae2b9eccbc0e1615bf3b` |
| `arm-unknown-linux-gnueabihf` | `7e74c57a08cc24adf1d425af6d3aa290bc77464d650a3bc6289b4b27885da4b9` |
| `x86_64-apple-darwin` | `f7022bd7f37a3a60cf7ca36463b5d24cbbb4eff77d30081e5127629368533989` |
| `x86_64-pc-windows-msvc` | `866c9841a2ba2c791f1e3b674f99e7b6d4331b19bcd4016fa7289524eb1cef58` |
| `x86_64-unknown-linux-musl` | `10de18185747702860fc9894bbd84247a371b0cbb5bf86f73ca872b54f83f133` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.3
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.3
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
      - uses: tombi-toml/setup-tombi@v1.8.3
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
