# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.2
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.2
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.2
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.2
  with:
    archive-checksum: '28c70c52f502c90cc675ff9d3feeaa43880de3eb79352969f9541e0b93b5e9aa'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `69b648d4d0a170ae7759d6667efd74cf9e1d0a9a6d47dce4ab7939ba682e8018` |
| `aarch64-pc-windows-msvc` | `d85c07d4376dac9a7bd77b1f37dd7d7a4cf036e1480d76483266bf078951fb64` |
| `aarch64-unknown-linux-musl` | `5588f60475436830b78fc5c2f6824dbad28be18cfb48f016eee7c5f1fed82615` |
| `arm-unknown-linux-gnueabihf` | `5fad30af48d9c84ff726fef3114147e1f648c42142437334fa9a09aaff51875e` |
| `x86_64-apple-darwin` | `fffdb9bdd43d508ca40df8162ab381dfab2d1676d95ad7eb1f4e126beeae7e9b` |
| `x86_64-pc-windows-msvc` | `b067e1038d8b643c18c0fa20827d6385508224e1672aa9d1f4f629071224347e` |
| `x86_64-unknown-linux-musl` | `28c70c52f502c90cc675ff9d3feeaa43880de3eb79352969f9541e0b93b5e9aa` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.2
  with:
    binary-checksum: '987fd1ce85d247cfb163fcab15403a6d011603260236aef7fd2c1505e520fe41'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `b7a530ef08f87db87c35cdff93288bc882c16f285dfc40c594b1dd79c29a387a` |
| `aarch64-pc-windows-msvc` | `298709476a68a7c6ce9a1912bd0c5a677f08e468b6589c2c1d987d1701dc2dff` |
| `aarch64-unknown-linux-musl` | `776c25f64f870c29b8231635547bedc86cc446e42566a0d8c140e472e29a168d` |
| `arm-unknown-linux-gnueabihf` | `fea1161a659d3b5a156aab38e3dcfec6ef0e78a308e63895a40f7f51b5eac555` |
| `x86_64-apple-darwin` | `b8084bbede760d8507a90556f4569922eb9b1ec3cf781f3e1157cbd62effda7a` |
| `x86_64-pc-windows-msvc` | `fe8b59b906ec4401b83b67efefc373083a2667078e06de70caf32722bfc9fd58` |
| `x86_64-unknown-linux-musl` | `987fd1ce85d247cfb163fcab15403a6d011603260236aef7fd2c1505e520fe41` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.2
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.2
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
      - uses: tombi-toml/setup-tombi@v1.9.2
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
