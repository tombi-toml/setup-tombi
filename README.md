# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.8
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.8
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.8
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.8
  with:
    archive-checksum: '4cb72901494b79e13db09bba44ea15fb0f7ddf40b2ff5d0aa0b83e5a1e17a51d'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `68261057cb8c3d1e0d675fb713ebd765b8a37cb03c2e5e11a3a2ad0e7b1fb270` |
| `aarch64-pc-windows-msvc` | `7a684c011b1e78df50b882ab5e066a00a3ee77eec4b6f313f104bb4f67e04887` |
| `aarch64-unknown-linux-musl` | `9785f7516026ac90a83bd55c6e2f0096b27d1a04bc5b8812b2501122136e5a16` |
| `arm-unknown-linux-gnueabihf` | `6e0eb53708b3eea6669e6258dcccce45e58710a225aa7554b1d8462fe86388ad` |
| `x86_64-apple-darwin` | `8f2bdef0d767dc096c92ca26705934792d6b456df29669d41e10978b51e11574` |
| `x86_64-pc-windows-msvc` | `cd123e9dee675458f541365e5f30bba313f8a8daf648760bdaa00caece19822f` |
| `x86_64-unknown-linux-musl` | `4cb72901494b79e13db09bba44ea15fb0f7ddf40b2ff5d0aa0b83e5a1e17a51d` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.8
  with:
    binary-checksum: 'd1c82379e5113188cbaf5f80c74a84f09bb59a118bf3e950d8c4bd5276566fbe'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `6a1a81292b87d7594bf20114da3346d63b25a937c560f5d671b3c52c1f32717d` |
| `aarch64-pc-windows-msvc` | `e71766b88375525b568e50ecc3e9083efc67b19c91873b1199177b3f3e700e26` |
| `aarch64-unknown-linux-musl` | `c9b7e85cd111658f95188e46a86dba17a139cf9aa432b6818880cd5c49386633` |
| `arm-unknown-linux-gnueabihf` | `21d62755bfc2677b52948b34c5912162cbdde4b913165c36e663f33de5d3ad97` |
| `x86_64-apple-darwin` | `0fd45ab6719dacda7bd4be7ce0ce69956bc9584217802b8e4f6402a2cfb1a41d` |
| `x86_64-pc-windows-msvc` | `91707247c11c3da86ca9757d1566679a0c3800ff9535518021810f4d5425fefe` |
| `x86_64-unknown-linux-musl` | `d1c82379e5113188cbaf5f80c74a84f09bb59a118bf3e950d8c4bd5276566fbe` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.8
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.8
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
      - uses: tombi-toml/setup-tombi@v1.5.8
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
