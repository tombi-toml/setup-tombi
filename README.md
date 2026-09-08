# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.3
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.3
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.3
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.3
  with:
    archive-checksum: '9e34fc7c089526e3608542b25227bbb67289ddaf66039a46b7c49b64b6931f37'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `9043a3bf322ee0254ffd51aee5c6adafd651434589b8d42cd14f02f2ddc01e8c` |
| `aarch64-pc-windows-msvc` | `102848b6b57dec5af5bb258c1e4937b18338e102afee57c4b12a6133a7c49937` |
| `aarch64-unknown-linux-musl` | `9892554b1fc0d9c57d7ee131a302af1bd90b66cd014505a40d20c2a94c3be4d6` |
| `arm-unknown-linux-gnueabihf` | `89e18a68b540bb6da6607c55c5518e82aba4800c26d6585b120e5da932abc91e` |
| `x86_64-apple-darwin` | `a746a38dc6c08fd67b61d3527ea922997243b0d78660690cdb809b7405a0b6e8` |
| `x86_64-pc-windows-msvc` | `9a45ec3df1dd2693e7ece01f552b0d1ef1885b8d701f396ebc0236165c554c0e` |
| `x86_64-unknown-linux-musl` | `9e34fc7c089526e3608542b25227bbb67289ddaf66039a46b7c49b64b6931f37` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.3
  with:
    binary-checksum: '647e7ecc83b09d67b6485f25e3a0d89e3cf4edcd6dc1dc904a12d25ecca32e9e'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `563ff5e648bfc4edc6358da8dc7dd190ca91d2d8043ba13641668b1d3c014521` |
| `aarch64-pc-windows-msvc` | `e2ad16384f805c448adc69e692f6fc3ceef3bf8620115285c62158306d6ceab0` |
| `aarch64-unknown-linux-musl` | `ef6ab096e936939cb8c8a8f72e55c183aacb8f457d34b6aa8a9c59a486282bcd` |
| `arm-unknown-linux-gnueabihf` | `495e9d3d1a1b910af20ff9a6e04e29eea9c55da9625946142f5c97a440548c3b` |
| `x86_64-apple-darwin` | `918030450991fd4b3ddc83cf93cbee643b7899fa6cf82ae0d1f3d3b266668f92` |
| `x86_64-pc-windows-msvc` | `dda417c24c528a741f646aa527b2cc84c15939ebc7658b20306404f4a187d67c` |
| `x86_64-unknown-linux-musl` | `647e7ecc83b09d67b6485f25e3a0d89e3cf4edcd6dc1dc904a12d25ecca32e9e` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.3
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.3
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
      - uses: tombi-toml/setup-tombi@v1.5.3
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
