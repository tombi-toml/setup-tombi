# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.10
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.10
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.10
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.10
  with:
    archive-checksum: '53f3a910a673eb05482cc720e3c1bb197b94f43496363394cffe22cab7a12222'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `3d860107751adc7d14e72d1924425227daecde5ef83be6b1b00ebdf50a81eb08` |
| `aarch64-pc-windows-msvc` | `916153d72a237494644b614e6168d14b6d637603958c2b3c24e32f06ef6bc7d9` |
| `aarch64-unknown-linux-musl` | `055099d86273cffa12a36460dc43e9c23502313d43892e0f835b919ee6fdf77c` |
| `arm-unknown-linux-gnueabihf` | `be4d7c3aca426f390ce519e2425c23f89cc20ab51422c5b13e6d53552b0b550d` |
| `x86_64-apple-darwin` | `ec0e0bfec103ac9136d3ac3a1cfe9e814ad7b52af4dd425a01b2fa0425a8d515` |
| `x86_64-pc-windows-msvc` | `769695f5b49048450c6775135ec40b33bf1d50b1d0dbcacded46aade4b526941` |
| `x86_64-unknown-linux-musl` | `53f3a910a673eb05482cc720e3c1bb197b94f43496363394cffe22cab7a12222` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.10
  with:
    binary-checksum: '2b2a19bd58e10a0461175201bb5bb2905fe749b8a3291e24e33466b78d65505a'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `e8098819ae752451ab72b2155a0613b6a9ff9354806f0ba53a4ddf51154a4abc` |
| `aarch64-pc-windows-msvc` | `182b28028559ad7f2998cc837fbb34387fb92d7b906ba3bf0045f182c5f6c4fe` |
| `aarch64-unknown-linux-musl` | `2b2a3b64c397e60b47a66bdf892a23abc914d6636a6b74a973a8ceec98843294` |
| `arm-unknown-linux-gnueabihf` | `5f34566b387a6dffd12dae6fb522decc175cf2f24f34e5867b279ded5f76b8bb` |
| `x86_64-apple-darwin` | `bfe5ff452cb8756e316b37c5a82cd0336e6d39975264a06598f8b0634cb34a20` |
| `x86_64-pc-windows-msvc` | `85cd12a6513d38e5095a8454bf31133638007918da726ceca2c1ffdf00607ccf` |
| `x86_64-unknown-linux-musl` | `2b2a19bd58e10a0461175201bb5bb2905fe749b8a3291e24e33466b78d65505a` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.10
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.10
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
      - uses: tombi-toml/setup-tombi@v1.5.10
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
