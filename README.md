# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.6
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.6
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.6
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.6
  with:
    archive-checksum: '5d576f506233ca83bcaf1c288835f9bd48e5df938192833ed33bb3fcf8304b1d'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `36e1284631d0fff32440243ee4b1cc609a28f9c2301d84f59c8ed5d70483ffd5` |
| `aarch64-pc-windows-msvc` | `3741e80f4caa02f17b1ea0940c49eedc23673f93a160c44347baa5f681a08e58` |
| `aarch64-unknown-linux-musl` | `8baea8853d87f076b87b9395feda5132257d1e47aae0430d2e3f94829059b171` |
| `arm-unknown-linux-gnueabihf` | `d0e089cdc954763c090fcfe0e6440dc6e96e7905081167ddc316fe1ac7f513fb` |
| `x86_64-apple-darwin` | `58c20e31e91107dc6bb90a99d7c548280e09e1a738acaafdbf888450ea976fde` |
| `x86_64-pc-windows-msvc` | `09fc62d751b84c00eea426da6cb54e881c6db412e1e5e7c7c0092a4d2ee8dd1b` |
| `x86_64-unknown-linux-musl` | `5d576f506233ca83bcaf1c288835f9bd48e5df938192833ed33bb3fcf8304b1d` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.6
  with:
    binary-checksum: 'd2d48b33c9e7b69c03b57c55160f84d7e8623b68341d3f260c479286564e785e'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `a1ee3eaa955eda4670d166473c70d8f8de0ce065f1402c2a2153a1f5e7a58dc8` |
| `aarch64-pc-windows-msvc` | `11aa8afca9a89164ba0b00fd58c097dd74d8ea9603f77d16ad49af6fa896ef68` |
| `aarch64-unknown-linux-musl` | `12ef9a4d41091ce4a47a482a9836f32c613055aaa9b075511f7bfe42326690de` |
| `arm-unknown-linux-gnueabihf` | `5e67f264974bf6cf217a63d87ab04114d05b1507d2f2f0ec31b2dd21221d796e` |
| `x86_64-apple-darwin` | `1b7293f31022f2837c454dc86c0962028fa81bebd8fc30946bea7eb698f846f3` |
| `x86_64-pc-windows-msvc` | `85b7d2d54627c398887fbe6f62040f177b35cd0435cd0127b0b735e01fef1207` |
| `x86_64-unknown-linux-musl` | `d2d48b33c9e7b69c03b57c55160f84d7e8623b68341d3f260c479286564e785e` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.6
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.6
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
      - uses: tombi-toml/setup-tombi@v1.8.6
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
