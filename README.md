# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    archive-checksum: '4f13c4349ccbf1f326834795ad69625f8aa863e5a92e71dfb245a51971576b25'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `32e48eb45f04ae2201a24b09f168ac0a4d15502e223d758fac0ff1f6ccf7d5e4` |
| `aarch64-pc-windows-msvc` | `aac6667eb3d15c8958dc941f2aada8d389b9964d87707711dc7c3cdeb3ad4048` |
| `aarch64-unknown-linux-musl` | `d95171ebc4330a3e55068cfc9372c899cefb27cfbeda9cb439f3861ab7446c90` |
| `arm-unknown-linux-gnueabihf` | `98c41aa624da0c82aa3bb48b6dbd4bf3f7f1d19229649a3b043d916eb129048c` |
| `x86_64-apple-darwin` | `ccd87264d9fddc2317d79a7f895e28b32c519d35db0aecd88a357c78854c8ae4` |
| `x86_64-pc-windows-msvc` | `51bcaa880bccdbedee920016af20cdbc400f3c4a15c6679adf8acb2b7359621b` |
| `x86_64-unknown-linux-musl` | `4f13c4349ccbf1f326834795ad69625f8aa863e5a92e71dfb245a51971576b25` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    binary-checksum: 'f1da4fc7e84487f05e1ac591e029ebc0380d6616e81da2104b1ea7a60a820082'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `589fa010e7528f7c0972e775aa4876bd259622a0c10a82449cb4328ef2ed95e6` |
| `aarch64-pc-windows-msvc` | `c62aac595b81029ca57af592970ae2d9d80015aa9e7f08f784732f1ae68888a5` |
| `aarch64-unknown-linux-musl` | `c66d57e291bf341a7beaa661562f06b962890faf00efea6834b6eface69aa6c1` |
| `arm-unknown-linux-gnueabihf` | `e2f1f09d5b38599f5d17eb45bdb7624ab50e31e61110052b48bd990d121e4e31` |
| `x86_64-apple-darwin` | `cf4ca9fa193d34ff5d9694e6a9fb91ac5389c8a962b58d84744dcb8f684210d5` |
| `x86_64-pc-windows-msvc` | `6006944c334ea21fd21db115212da0b62ce7e24321145708b53af66473635991` |
| `x86_64-unknown-linux-musl` | `f1da4fc7e84487f05e1ac591e029ebc0380d6616e81da2104b1ea7a60a820082` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.3
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
      - uses: tombi-toml/setup-tombi@v1.2.3
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
