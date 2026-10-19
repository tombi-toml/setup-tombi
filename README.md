# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.9
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.9
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.9
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.9
  with:
    archive-checksum: '26d7207a4de89e5d846d5a9e5d3bc9c407f8b035f06adfdb774564bd7e440c15'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `287d02319d42d997237cab16a9876c0c116ea654be82f31e19c10c0a24159a60` |
| `aarch64-pc-windows-msvc` | `637c5c76b5cfff2741f46e3fe7069177f0066d387bd498225ca4e3a183127452` |
| `aarch64-unknown-linux-musl` | `4862f4fea963536bfb07678bed3d005735408e700701e979e6b68b9571084de6` |
| `arm-unknown-linux-gnueabihf` | `0bb55fe8497448b233197d6e524541a9d4def1198f2ecdca0eedf1588def9189` |
| `x86_64-apple-darwin` | `c566db7e0d1b98b75ebdbd080d75407140039eb52a7af503e3028e318f01f8f2` |
| `x86_64-pc-windows-msvc` | `c6b6efff4e1d480087a0c672969d21e66ea60e6844efe94492be10b8fd99a326` |
| `x86_64-unknown-linux-musl` | `26d7207a4de89e5d846d5a9e5d3bc9c407f8b035f06adfdb774564bd7e440c15` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.9
  with:
    binary-checksum: '206ac940e40e86a37a55e0a9ff43388533d0807ae25cdbbf679ed0c42a3662d1'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `5e569158bb9757b5708063e8152d3a9d6ac39a74cf5eb79ab3a0c214645bf94a` |
| `aarch64-pc-windows-msvc` | `4615d616359e7e5b71a1b2233aa5bbee837014d080fa43189f19a357251fbf50` |
| `aarch64-unknown-linux-musl` | `9c517ca967e6ac9ae305c6527c6330dbcadf4fe627ce58eab19cce39447821d7` |
| `arm-unknown-linux-gnueabihf` | `f5b095d50e0c5d7cc3d42ae85bef796afa19e8371de572aab5455519d99054ad` |
| `x86_64-apple-darwin` | `d8fe308de4961a735a278602c000efc405fe1b1bef4868957cc243fc1a49dd60` |
| `x86_64-pc-windows-msvc` | `95e740255641f983d5b0b032ad247b3c65ad3fc40009f8bcf1ddcbd29aff29e0` |
| `x86_64-unknown-linux-musl` | `206ac940e40e86a37a55e0a9ff43388533d0807ae25cdbbf679ed0c42a3662d1` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.9
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.9
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
      - uses: tombi-toml/setup-tombi@v1.8.9
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
