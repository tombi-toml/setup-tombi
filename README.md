# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.11.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.11.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.11.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.11.0
  with:
    archive-checksum: '5114f61bb3667f6ebf7bb818c7702beb4f3ec4860dbc9401f907f029074fb806'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `36164f7579cee9c691f96ef2a1312c4c04fcefa6e066e9f9f64dedbedcb675b0` |
| `aarch64-pc-windows-msvc` | `9992f62bfd99ff8a15edde931bbd6f60b63dc891741fb89d2559068ede489247` |
| `aarch64-unknown-linux-musl` | `acfb0e82cd1d43996da0830e82649771c7989f5cc961cfff3815c2d16260a8d2` |
| `arm-unknown-linux-gnueabihf` | `a4e517a20fd87704f4fa73ee6c55da3629ada6e335173f9b36f7398720459e7b` |
| `x86_64-apple-darwin` | `0024f7667fc5c2572f8f82203e65b609375f97071e321d756eebbf064dbbc5a2` |
| `x86_64-pc-windows-msvc` | `e2f4cbb7edcc8eae93db24805a0cbdef98a77ca2391755ae0be38284fd4c5a89` |
| `x86_64-unknown-linux-musl` | `5114f61bb3667f6ebf7bb818c7702beb4f3ec4860dbc9401f907f029074fb806` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.11.0
  with:
    binary-checksum: '355e9a2d55d08924d11da6e40961a8b9b7532d5e3945a53cae9047e3cb6ee427'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `d10546e9d8978634503d039a9b9fe9425ba279cf8922b864f47ac31a2f8703f0` |
| `aarch64-pc-windows-msvc` | `ef2dc69e8551e5423cb8b23126c2ddcf545cfee0b4267e1698eb4dda9d9b6eeb` |
| `aarch64-unknown-linux-musl` | `29cf419435940db422a0dcd658311498579337b1c548273ce1e452f9873b6fba` |
| `arm-unknown-linux-gnueabihf` | `7f4fd1fce00f5b35879e9f9f946239c0c056811568d0b9d8ec4b802dd1e1d06e` |
| `x86_64-apple-darwin` | `69c60403f9a4737e417aac604916d6a6fe2213b216e34c9c0f356ccdb0a164b4` |
| `x86_64-pc-windows-msvc` | `1a8dfbfbf2c1b4f264258230278652a8ba505da59eba41ce2df2d9b53d775aed` |
| `x86_64-unknown-linux-musl` | `355e9a2d55d08924d11da6e40961a8b9b7532d5e3945a53cae9047e3cb6ee427` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.11.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.11.0
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
      - uses: tombi-toml/setup-tombi@v1.11.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
