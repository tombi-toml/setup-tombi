# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.6.1
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.6.1
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.6.1
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.6.1
  with:
    archive-checksum: 'd9de2450f5477a9c20d7942c45e6131e2fba22e0b94121680ca2391f4210ab7d'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `c604b76a37aa00db7b465a179569cd10acf6ed5df7e5062379a61086777bd511` |
| `aarch64-pc-windows-msvc` | `49c11ca313da799330c84316136fbe9bbf6127b32ee4196ffd6836bfefb099e9` |
| `aarch64-unknown-linux-musl` | `6fb2a5c04928cda08ab74eee095917abbca3c4805a168c0f59ff7165afb0c88f` |
| `arm-unknown-linux-gnueabihf` | `a3a5e949073e330904a19e06ba8b76fba0ca62dab5aa4095bb4c1ac7e673fba7` |
| `x86_64-apple-darwin` | `3709e4914282cea7f16acf7c34321ba56882e0440a3f6b9954bb90d9a11fe2d5` |
| `x86_64-pc-windows-msvc` | `f83d2f9214287056b16aebc8ebd7093285e136646ec745d01982806df791dec7` |
| `x86_64-unknown-linux-musl` | `d9de2450f5477a9c20d7942c45e6131e2fba22e0b94121680ca2391f4210ab7d` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.6.1
  with:
    binary-checksum: '7b30ec2f40c0893ca137963a80bb2912511ab0685208ad29af5845243ba56166'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `b3e157bb92ee4a75850a55d5362e97314077991fe32bef309d1ab717b5128ae6` |
| `aarch64-pc-windows-msvc` | `16a9fadbc18ac0c026379e70eca2b24517e6cb35d961b8ae8b3174787a62f465` |
| `aarch64-unknown-linux-musl` | `865287b83fab418626508a7e78d14b50f0774ab08b84f3e5e99861085875ccaf` |
| `arm-unknown-linux-gnueabihf` | `6800a88c825e232159ea856dee948439f7c92c3a7bd3f79ba0e7f4f8398d5b21` |
| `x86_64-apple-darwin` | `110df07a07b7f98ba37de8c6d00a2ce7dcbde4a5cd918ec7d73a8c723cd6472d` |
| `x86_64-pc-windows-msvc` | `78e2c97e5d2ef3958b816223dcd2f6c286bbddf46c89d3878f30653610eafbcb` |
| `x86_64-unknown-linux-musl` | `7b30ec2f40c0893ca137963a80bb2912511ab0685208ad29af5845243ba56166` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.6.1
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.6.1
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
      - uses: tombi-toml/setup-tombi@v1.6.1
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
