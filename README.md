# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.5
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.5
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.5
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.5
  with:
    archive-checksum: '6c50d2589989e8182e9f6e774b4b25c9f5729b67a2a7e7dcaadddbedbe1da5ec'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `460b3269414d2ca26e05863908764f118bea3b4a52068081af6a3dae03c1320e` |
| `aarch64-pc-windows-msvc` | `5815560e96f60e4d64a7205c219661ef623987b6e847ef1c1ad3e316685224fa` |
| `aarch64-unknown-linux-musl` | `a545a471cec6baf982bcb8e274d097303cece1a72136ada79d240adb6d1354f6` |
| `arm-unknown-linux-gnueabihf` | `fc2022ad2d881d097f5fb2050947ac43cbab9c5a502b444fa5b25fe9d76e14ff` |
| `x86_64-apple-darwin` | `9276c456e4a0217e95fb84ac3cde29d281d7b53e5eb168d83cb038ec07e2083d` |
| `x86_64-pc-windows-msvc` | `49e8aa14e82038a13c5f9f50cc6524b56b9bce167734bead31439939e0830a3b` |
| `x86_64-unknown-linux-musl` | `6c50d2589989e8182e9f6e774b4b25c9f5729b67a2a7e7dcaadddbedbe1da5ec` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.5
  with:
    binary-checksum: '257d463fff5229b5b6996feb64d194b2256b1b65c0a1633adf05f9f016fec996'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `e146e41ef8699d6c580c204cbec68650dd82c0cea9d34cc418c1d63d5f2ec68f` |
| `aarch64-pc-windows-msvc` | `d5e6ff1cc3d95a50c62e07a65be7184235259a7b10f4d398a56699e5053c8f2d` |
| `aarch64-unknown-linux-musl` | `3e346a6afa8fc623a18f653a02e6e442f0e31207e1e777847b977e3922886882` |
| `arm-unknown-linux-gnueabihf` | `67a065db71bae75d98ff055560e732a47bbbdad2918dc1de5e37c87b5d0130ff` |
| `x86_64-apple-darwin` | `561f1b2fa07296ba756d1ebe8efd67f0db723c7bc7acc77e537f8e9a5fa1a988` |
| `x86_64-pc-windows-msvc` | `3fb4178d89b959d684149c165fbe82057e6638d01ffa1d449d06e83a8feea59f` |
| `x86_64-unknown-linux-musl` | `257d463fff5229b5b6996feb64d194b2256b1b65c0a1633adf05f9f016fec996` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.5
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.5
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
      - uses: tombi-toml/setup-tombi@v1.5.5
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
