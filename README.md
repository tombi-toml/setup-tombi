# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.7
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.7
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.7
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.7
  with:
    archive-checksum: '4bab30c956cc2defa5966f78e199c4c0a57e9795964142fdd6c007596519787e'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `bfda372442e224febf416a18cdc8099b1188cc1bc70260d1daa4d7ddafc45fa1` |
| `aarch64-pc-windows-msvc` | `d97b30a61b2e4046aac75d727ee914b5e7bddcc58b34a1aba895550b1a71abf2` |
| `aarch64-unknown-linux-musl` | `45c14f2aadc1f8122735dd55961b383ea554979d0ba0f3ee3f3c44cd3a5aaeae` |
| `arm-unknown-linux-gnueabihf` | `2d79d3b0f3df9a7074b7542e5378ce9469e9460dc18f2c14857f8b45c9e1bb4a` |
| `x86_64-apple-darwin` | `d5f547152d1746957146c54cc2bc05c2c38bcb91506a372e17a9fe2925ed6d84` |
| `x86_64-pc-windows-msvc` | `6cd38ddb14c3cecde86becbad22a3e8e4e73aa53c98197e78e68f742096e3585` |
| `x86_64-unknown-linux-musl` | `4bab30c956cc2defa5966f78e199c4c0a57e9795964142fdd6c007596519787e` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.7
  with:
    binary-checksum: 'da33a88e2d02290bba60a284d69b8c8f27f2902ec80952845cec2a72180cc975'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `f2d7bed191afe5c2394f679c5a612d3a5aa9a7c41ca70f42b82e96543c4238ba` |
| `aarch64-pc-windows-msvc` | `0785276fbf101bc137c1011dc75297ea8a9bb0cf4e06b95e1a512072ff65f235` |
| `aarch64-unknown-linux-musl` | `3988c79f0239ce369184901eeccac87f2c2c9374dbbe2e336b616e416743c376` |
| `arm-unknown-linux-gnueabihf` | `04b258688aca089eb33f9ac95af5d8cc60e64e0a245c6730f59959a9481b295e` |
| `x86_64-apple-darwin` | `7e2f4d050d8829f45600be4780389d5eb7a8f6446b00b14541a2fae2245b00e6` |
| `x86_64-pc-windows-msvc` | `23ca33575ce63e12af42df09aaa126572a3014836904e534e99323f74ad2fdbb` |
| `x86_64-unknown-linux-musl` | `da33a88e2d02290bba60a284d69b8c8f27f2902ec80952845cec2a72180cc975` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.7
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.7
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
      - uses: tombi-toml/setup-tombi@v1.9.7
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
