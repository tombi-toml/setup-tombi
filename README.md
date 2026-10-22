# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.0
  with:
    archive-checksum: '8d67a6d488be4186ad0a14e0cd0293e4893b9c4c66d41f958d22987749d56ec8'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `380797de9eeec47ce91a0408f948c424d95ea55bfab59364bd7207f66848996a` |
| `aarch64-pc-windows-msvc` | `cef7287f487f279bb5155d3eb306eeebdd79db8d82fa6abe72e2f57b8a83fc6b` |
| `aarch64-unknown-linux-musl` | `66eae15cf2c7644fa318de6c72857303d86bdadbced9f8c372a6fa5f65e47d47` |
| `arm-unknown-linux-gnueabihf` | `5b53fcf8a1a4cc0a3f3499bf0027a0e556da123e2841fc7fa9293091e6125638` |
| `x86_64-apple-darwin` | `e85b1630a8598c9f2f449de6132a21261e5d57ad963cc7558634bd1af266b04b` |
| `x86_64-pc-windows-msvc` | `ad04974c44fc46fb4a03040ef91a20c00aadb8b32934bb3f909df9a7db8c5d5e` |
| `x86_64-unknown-linux-musl` | `8d67a6d488be4186ad0a14e0cd0293e4893b9c4c66d41f958d22987749d56ec8` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.0
  with:
    binary-checksum: 'd8e0a5dbfbd185c0f96272d0326c83dd5d7cb4b4b40840738259febab13cdb28'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `13e365e35dfc6afb41802ad6deb987b726ebcb72b44946613c5cb8336abb55b6` |
| `aarch64-pc-windows-msvc` | `3a6755dfa37713435e2957c73bd57c1927d05f43e42f24192e311814543537c5` |
| `aarch64-unknown-linux-musl` | `c86b76e36cc96a23d77df7bd4b95c237243355779fcc90b2dd5fc594f81a5a43` |
| `arm-unknown-linux-gnueabihf` | `d944ee28eef0c26b2dfcd8913b8cba51fb4a45e3a1f713102b9814204fac2599` |
| `x86_64-apple-darwin` | `3e825a90813ca0c76426cae16167858b2825f54010a325b31909b36bac620728` |
| `x86_64-pc-windows-msvc` | `f7bd0556c75f025034d3815b115c2e4ab6e3102a9780c76a65473e5ee0da312f` |
| `x86_64-unknown-linux-musl` | `d8e0a5dbfbd185c0f96272d0326c83dd5d7cb4b4b40840738259febab13cdb28` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.0
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
      - uses: tombi-toml/setup-tombi@v1.9.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
