# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.4
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.4
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.4
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.4
  with:
    archive-checksum: '4a0cb6cb01b54c1bcfb53c4260ee13dc03c6d38058e4167043c10594df7209f0'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `4649074702d22acf8849366c081d53ab94eac4b62c186f5334690dcc69387baa` |
| `aarch64-pc-windows-msvc` | `b847ca2cb48e75c25e5831b21f86cb3749e1b3ddd9eeaeeb0e9e31301ca65e79` |
| `aarch64-unknown-linux-musl` | `fbb05d8e4d27d0fe961f3ec7a19ec3ba2c70e72ac759fe9da5cf843576d5ee39` |
| `arm-unknown-linux-gnueabihf` | `fff9b75164041feb95bd8f74308e7a548aa153c945eb454489c980f3154d3463` |
| `x86_64-apple-darwin` | `8d05ef3d44374703d9d84daaeeba1931c19f080172a2cd9bf6c18e2d28bbcafd` |
| `x86_64-pc-windows-msvc` | `5ea68b3067b22a8977286eec080839325eed5103668d9fd44629fa1c796344e0` |
| `x86_64-unknown-linux-musl` | `4a0cb6cb01b54c1bcfb53c4260ee13dc03c6d38058e4167043c10594df7209f0` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.4
  with:
    binary-checksum: '5e4947e848dbb5f0e7446dd70ac24cc96488d8a6080c32e4ead9f6603dd01131'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `05afd07b91e41b618121b9fbc2183fb9d2beb42dbd9125b432df3d48224982bd` |
| `aarch64-pc-windows-msvc` | `7561c3ae38bbf7bfe1009424aa56a8093e78a619936326aa7d4fb76cd4a2fc92` |
| `aarch64-unknown-linux-musl` | `955b849a105815c4a8aa580ecf5c73d4601a46b63348996bc974cd19be7b30fe` |
| `arm-unknown-linux-gnueabihf` | `c34e1560bfbe9a329e0bcb228b0ff16cba9e8c8fd4c11a2affa56f5962bbcb7f` |
| `x86_64-apple-darwin` | `b4473b349162dc197205258f9d5ff358a5205beccec69429904f999d12a734c4` |
| `x86_64-pc-windows-msvc` | `731d70ce14ca4d59ccb6bcce964a804d685f70445c8a194a45ec641361b1ff41` |
| `x86_64-unknown-linux-musl` | `5e4947e848dbb5f0e7446dd70ac24cc96488d8a6080c32e4ead9f6603dd01131` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.4
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.4
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
      - uses: tombi-toml/setup-tombi@v1.9.4
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
