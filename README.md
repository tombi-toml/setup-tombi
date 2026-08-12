# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.3.3
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.3.3
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.3.3
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.3.3
  with:
    archive-checksum: '768b8a8fc8eab01d2a65b100eb8db8da6297a0ba3d076ece65a99a74e69e1bb0'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `2160de191f65ab2acac1e040ba60f2a7705f9f6cd240c8fe50eff718b16f9712` |
| `aarch64-pc-windows-msvc` | `05abe6fbe4d5b1b56994dfc36367470fd7a45088e1349b839335230f9f3c5cd3` |
| `aarch64-unknown-linux-musl` | `a06b57ce41c8cf72aa0590fdbe8a29336ed17b5fc922d00b9b46ad8071684b3f` |
| `arm-unknown-linux-gnueabihf` | `38f496ea2078af4e28cf01170a9a03f9a44b0fa10b30488f5f6c468a8a20cf06` |
| `x86_64-apple-darwin` | `360cce7270f1077e203eb94c1e8e6c74ba9bdc3d665005a93537d1e2da57b4eb` |
| `x86_64-pc-windows-msvc` | `27f21955abaf7731338cc46e0561a9d760562ab0f34889b31628211951d96b0f` |
| `x86_64-unknown-linux-musl` | `768b8a8fc8eab01d2a65b100eb8db8da6297a0ba3d076ece65a99a74e69e1bb0` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.3.3
  with:
    binary-checksum: '7eb9d4e9afdb1721960c1878670184eb1c18db5c9c702f008d9cf84fc6626869'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `2774608c4067e89833ae73cfb2ba4597c8760edd9ff748a8ab1cabcd618112ac` |
| `aarch64-pc-windows-msvc` | `8ef3ad87b91436eb94f6fc4f592151143e73caf84d4dd6fdd5e3814a9996f415` |
| `aarch64-unknown-linux-musl` | `ce6d0f13231d3e6f759b41f6e009b31a9038c2eea5ffa80b4b0dd4c000ff2f8e` |
| `arm-unknown-linux-gnueabihf` | `f90a23fe907e62a09a681d7fd790433110c6458db9f902387bff9a9d839154bb` |
| `x86_64-apple-darwin` | `9bc5bcdd8e300bf1bb35f3e253e278ae24e2279cda295243c611fdcdb99be26c` |
| `x86_64-pc-windows-msvc` | `03bdcf43d4f36004c4db577a6d15fcd9e274941f1e4163da210f7ca82dc0350e` |
| `x86_64-unknown-linux-musl` | `7eb9d4e9afdb1721960c1878670184eb1c18db5c9c702f008d9cf84fc6626869` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.3.3
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.3.3
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
      - uses: tombi-toml/setup-tombi@v1.3.3
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
