# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.7
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.7
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.7
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.7
  with:
    archive-checksum: '05ee5cb56990f5b9129e3637f50b2d11ff316e01cc60750a93742fdaacd9aa63'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `c148a484358e9fe2ac05803783603ebc827c4efa7306918fa91c0f56b9b05bcb` |
| `aarch64-pc-windows-msvc` | `2a2f8a187fcae371f1027cd8cb4920d4f6fc962fc25e9e0479d2818674205f1e` |
| `aarch64-unknown-linux-musl` | `0f625cb29666d4d89257ae4a9dc13d238a9b22278fbd5836d3c658a4eadff8d3` |
| `arm-unknown-linux-gnueabihf` | `65ac5a9fdc2f7c2f5b67c09521147f3007d596ad6cd3886428af80c759fb8981` |
| `x86_64-apple-darwin` | `7858afa225930b6fef5a8851085eacda0bca5acc7622d003229499f9f14c5259` |
| `x86_64-pc-windows-msvc` | `08a5ba68cd5fba091ee54a8e4386113c65402244097dd555edf2ea5438f7a22c` |
| `x86_64-unknown-linux-musl` | `05ee5cb56990f5b9129e3637f50b2d11ff316e01cc60750a93742fdaacd9aa63` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.7
  with:
    binary-checksum: 'e12cf2b6d5e922b3d54b5c8b26eaae500943324060e6097897db742209031d79'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `4a4a1e29d85ac164edb5dfe05b1166bfe74a9d8a82cb914100298370f853c648` |
| `aarch64-pc-windows-msvc` | `bc29354a0c5efc17dcd3367db433f3e8a2716422e45173d7a8470349af36de93` |
| `aarch64-unknown-linux-musl` | `256b33f000172d9e8c400c4a6136380cf54fc0c5b8be2b6465ea946f270b372a` |
| `arm-unknown-linux-gnueabihf` | `c0160a127c55a00d79e5a22830796d0936c2cc2de2372df464a0c77cd997b1f9` |
| `x86_64-apple-darwin` | `1de9960383d6e3eee1ee3e0d57c4124af09525aaf3c361eb7a2048d58c62c2e5` |
| `x86_64-pc-windows-msvc` | `9d557ef1d2d447d075bae87849cd892f5ed9e1e7a219e2cffe8a836606da9700` |
| `x86_64-unknown-linux-musl` | `e12cf2b6d5e922b3d54b5c8b26eaae500943324060e6097897db742209031d79` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.7
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.7
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
      - uses: tombi-toml/setup-tombi@v1.8.7
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
