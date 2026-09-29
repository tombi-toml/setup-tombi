# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.6.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.6.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.6.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.6.0
  with:
    archive-checksum: 'cd4e803a1d46a0ffe28c9189c78eeabdc64571ef32fa69a8d3c1258b1a87434f'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `becb6aa171b703ca078af68a24351485e8d4320f56e1bde125f2016cf2fa22fa` |
| `aarch64-pc-windows-msvc` | `40b69919e21b7045f4de01a2e6f8b6b497a81233210ce51fb5c21a138af165e8` |
| `aarch64-unknown-linux-musl` | `381fc4b4d680358ed25396377e0aa3f98a7434282576f14d4bf004569962d822` |
| `arm-unknown-linux-gnueabihf` | `58279b022e6d813ced96e69d140900cf25e938834f0fdbe86db57f9c40030c64` |
| `x86_64-apple-darwin` | `80cbe84788c8019a59e0d753fa5c2120132db1aa5a7ad9c972667f4afd9eb49c` |
| `x86_64-pc-windows-msvc` | `4690a530675a4fe1ebe561d4e32b3332c77acdff0c96d3a44ed0fd5ac6273b45` |
| `x86_64-unknown-linux-musl` | `cd4e803a1d46a0ffe28c9189c78eeabdc64571ef32fa69a8d3c1258b1a87434f` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.6.0
  with:
    binary-checksum: 'af121464f684fb4cda61775214355f6f5ca9514a89f3d1a00fee63febd331b36'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `724c9f10a7a5e5472268e9fc053d5948c5cdeca552219b5d301ef868ef7ed6db` |
| `aarch64-pc-windows-msvc` | `33e6f0f367f47c0ce943e3f8ec9f475de74c6e78a59b6f79bfe85b5af3017f02` |
| `aarch64-unknown-linux-musl` | `af1cdefc21c36d36ba309479ebfa6f2d7c827b9d8a1decf951084d185c3e504c` |
| `arm-unknown-linux-gnueabihf` | `f5b8660fef5888e40404f831d903f7b5ed6958655943e922a70bc8ad065decee` |
| `x86_64-apple-darwin` | `de211b21be4935f938ec7eaafed2567fe7b6ea6e02fde79c0240b2d66eb4be3a` |
| `x86_64-pc-windows-msvc` | `4964e25ade396a45fbf36791d6917f62050007545105743d591f94dd249eda9c` |
| `x86_64-unknown-linux-musl` | `af121464f684fb4cda61775214355f6f5ca9514a89f3d1a00fee63febd331b36` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.6.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.6.0
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
      - uses: tombi-toml/setup-tombi@v1.6.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
