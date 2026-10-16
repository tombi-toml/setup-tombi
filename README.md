# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.5
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.5
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.5
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.5
  with:
    archive-checksum: '3663f6e90fb2c4026594867c651e040c6000c48406747215ad6e71c6066891c1'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `0533e3bf3c271d124e717bbc1acaefdc8302978463e335e00d35f0373643244f` |
| `aarch64-pc-windows-msvc` | `516b31b2ee406d6d25d63f1d3e29e1c79c25a8fd8f10049b3d9711bf8a74bf9b` |
| `aarch64-unknown-linux-musl` | `96665a5b2be8d87102f341c26487d31a1452a8aff11b2d9019deaf592b5e2ac9` |
| `arm-unknown-linux-gnueabihf` | `677d02e5d6967c5c801376f7fa2e0e83e9aed3b17b10cf6a87ecacd16d92bdcc` |
| `x86_64-apple-darwin` | `d530a4ae5855efb6494851f759d093248a4c83bd8afeb62e588c71fcacfe286c` |
| `x86_64-pc-windows-msvc` | `0f4e2f3c14b076d69a3a836593ef9bad8fae3295676ca21bb1279d0045e194f7` |
| `x86_64-unknown-linux-musl` | `3663f6e90fb2c4026594867c651e040c6000c48406747215ad6e71c6066891c1` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.5
  with:
    binary-checksum: 'c5509fce4f51f154d90192092427fb751f3ca6f6f735be0327beb5429dc083fb'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `6d6faafa67c6e3d5aa588d22d2c51a07502a35ec47823934ca5e2d3904e669cb` |
| `aarch64-pc-windows-msvc` | `c00948cc8d64a6c23679a0cd467a7255f0147d9f0046a984e8b1b3e9291fb08d` |
| `aarch64-unknown-linux-musl` | `ba32b41a2b45d026b2a5b031b73ef8df5a72eaa465e84f729040b9027cf194f9` |
| `arm-unknown-linux-gnueabihf` | `d3a61f3162e71220debcfefd30859a88e70a974c2058c123f6a459be20a9d25b` |
| `x86_64-apple-darwin` | `6a0b3197df172a98b265d06514195fe19a2c8ba0afa11211c8f4aeda0b93d5bf` |
| `x86_64-pc-windows-msvc` | `3c8cd4e54458ae13d7854aef9d4c466a49934a82e809e52bc8328d51d36bca0d` |
| `x86_64-unknown-linux-musl` | `c5509fce4f51f154d90192092427fb751f3ca6f6f735be0327beb5429dc083fb` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.5
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.5
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
      - uses: tombi-toml/setup-tombi@v1.8.5
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
