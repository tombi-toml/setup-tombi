# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.7.1
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.7.1
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.7.1
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.7.1
  with:
    archive-checksum: '1611a2d7e16b11a8abf71c25f079eebeae845649bee795aa3828f142515fc070'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `9ccc41a4fc8c36dfaa71dde1ad6a7734c4f3a8f9e63936b72a468a65fbc3507d` |
| `aarch64-pc-windows-msvc` | `d6ae2220ebf4f71e0caa57b82b93048369068a67e62cb75ff4e73415f32f3851` |
| `aarch64-unknown-linux-musl` | `d5036ba08d803d98bf99351fd4cca55a1c240b4ea7ea9499f9d5336016320c05` |
| `arm-unknown-linux-gnueabihf` | `6d97ba7f3ed7453ef8617ddac573615e98ade5d94fc59c8e0d8b8c7cba51c70f` |
| `x86_64-apple-darwin` | `4182de4a13e72d8073cd70dfff30b9dcbde9ce15bd1b1beae54357cba5c34cd4` |
| `x86_64-pc-windows-msvc` | `4abee0008e4c18f2d0b8fcea72b5f1d73b04b398d3b1cf63d73040d1420e9caa` |
| `x86_64-unknown-linux-musl` | `1611a2d7e16b11a8abf71c25f079eebeae845649bee795aa3828f142515fc070` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.7.1
  with:
    binary-checksum: 'c41c5b6154b204807309ae3de9ddfbfa5459516a1d23882874f7563579ee69e1'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `af7975822f098fa49f07a6b13b27696e3578c8bd91eb037565a43b4ae35d3b7f` |
| `aarch64-pc-windows-msvc` | `6ba9c3da181395998a079c9c9fd74ad240aed12690077d92eca34858eece5538` |
| `aarch64-unknown-linux-musl` | `9d675d2d26ec7395a838e1b2ba8ada249895a4f11fb813e22136b500d082732d` |
| `arm-unknown-linux-gnueabihf` | `4524b680bcf7a151f4de1421e1baad19e4b43c4751e02528d38d499678b970e1` |
| `x86_64-apple-darwin` | `a6ea99f31ae2c0625c0229ee0ef2426a91317913b24e1f1e7516e61cb8fdb07e` |
| `x86_64-pc-windows-msvc` | `997fe2345138c8c1e2a665dc84bacf8011e4986e94f37c34493728e214f05a3c` |
| `x86_64-unknown-linux-musl` | `c41c5b6154b204807309ae3de9ddfbfa5459516a1d23882874f7563579ee69e1` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.7.1
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.7.1
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
      - uses: tombi-toml/setup-tombi@v1.7.1
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
