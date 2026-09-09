# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.4
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.4
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.4
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.4
  with:
    archive-checksum: '072a1d61e61d9137bcea2754568181370f8f3dcde85bef457c2c07529699ee6e'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `753a8ad56b658965a6f248438373c96465f991704ef59fe8bc04fcc31a4f4c88` |
| `aarch64-pc-windows-msvc` | `d44adac699c4772511244a717ff6da57e60a957202a240de5210aeeeb9988eb7` |
| `aarch64-unknown-linux-musl` | `c715b9430b18c37e4f719cb5282e1d3352629dc027a8098d3bd116571f9cf034` |
| `arm-unknown-linux-gnueabihf` | `89383c951d24257e7c70bb955cba917e1a0611444b8cd05a73b8ce2fc1f4ddce` |
| `x86_64-apple-darwin` | `a4a79dca35dcaa9bc535eef05ebd164829023977f97ba4e3b88f63468d9d6762` |
| `x86_64-pc-windows-msvc` | `cf20b34bef7c2ebe2e700af3f49ce501ab37c0339605bb122885bc8f8eec3c47` |
| `x86_64-unknown-linux-musl` | `072a1d61e61d9137bcea2754568181370f8f3dcde85bef457c2c07529699ee6e` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.4
  with:
    binary-checksum: '9c5e1ae35defd3baa2200a76edd955afba1704104cdba6aa2cef0216e73b090b'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `2b322cf92e16d8f9c76b2eedda1396089d3e7f1a0692a5d3bb9ea87c03784e45` |
| `aarch64-pc-windows-msvc` | `b5e4364989d95e3fbcdd4ac175048836b99241519b04690bda509eb232d1e2bb` |
| `aarch64-unknown-linux-musl` | `552225e2cf144823c9279616e9c5e1f049efb7bfb9bca3598c5d84d905ecd0cb` |
| `arm-unknown-linux-gnueabihf` | `940834ffdf56b08d4f7377a901e42f1f5cad3ed36c8837b2ac2d4f67fbc78a2b` |
| `x86_64-apple-darwin` | `0fea3a697dc99f15492322fc283db9ecfcc0062b5da1713cf3d034eb5697f8fa` |
| `x86_64-pc-windows-msvc` | `92e06259598fa14cf205731fc676ea83a2a9079ee12c91ce3e234cbe8e859aca` |
| `x86_64-unknown-linux-musl` | `9c5e1ae35defd3baa2200a76edd955afba1704104cdba6aa2cef0216e73b090b` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.4
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.4
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
      - uses: tombi-toml/setup-tombi@v1.5.4
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
