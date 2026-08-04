# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.6
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.6
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.6
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.6
  with:
    archive-checksum: '43f8e209818f425d45fca06797eec44b1cf643e8a58c74f29dbdaaaf827052e0'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `d746072a5edb7d14b413a80f14892e4d299babf3b9b370faecc29571cbdc2c7c` |
| `aarch64-pc-windows-msvc` | `f5d67d8336210baf60ab531075620c956b2a0f4b061f78f5de8050c0d11c23f9` |
| `aarch64-unknown-linux-musl` | `f1505c4a3db78c8dbe249780cbb6b597b7afb195f0852308d3939df547a0af7f` |
| `arm-unknown-linux-gnueabihf` | `1019858713098c9dab53aab0b9db936bf0c40e2b5f5e9b7b80ec1962c0fac648` |
| `x86_64-apple-darwin` | `7a7a19b51373e91e6db6c5b2bbe130c579b1d11f31b7789d7aa0aef7bc7ec504` |
| `x86_64-pc-windows-msvc` | `83c4deedd3f169485d5f83562087eb74187939bf10cb0ef9e5bed14bcfdad659` |
| `x86_64-unknown-linux-musl` | `43f8e209818f425d45fca06797eec44b1cf643e8a58c74f29dbdaaaf827052e0` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.6
  with:
    binary-checksum: '22fdf54b170bd6f2e4aa4123b942110ce1c4e568a4b4a6bd7da45891951ec6e4'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `b363857f342a3d197ae8ca772ebaa8fa49dbec2e5b6b340247a0695bb37f43c8` |
| `aarch64-pc-windows-msvc` | `a1e14bd9803f3e6e8242b4a38b60923fbccb3b2d8be2bcf210d2937f15467b41` |
| `aarch64-unknown-linux-musl` | `77d0efe6655ace86fea8ad8721195e3bc453c8c944147562a886146ebbeab574` |
| `arm-unknown-linux-gnueabihf` | `1b01e9ae188c30958309440804717c08a0381d06989520646cfe6c1f8aa549de` |
| `x86_64-apple-darwin` | `f1c3fafcfedac14bf5681f3659fe0fa0c5afe0bf592bb49c6f81df8bf509aa0d` |
| `x86_64-pc-windows-msvc` | `5008e76e3ea7e8d3f07c99c0fe9cdb3a160ac3a2279041f3c744ccdcdf0ccae8` |
| `x86_64-unknown-linux-musl` | `22fdf54b170bd6f2e4aa4123b942110ce1c4e568a4b4a6bd7da45891951ec6e4` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.6
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.6
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
      - uses: tombi-toml/setup-tombi@v1.2.6
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
