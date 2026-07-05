# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.0
  with:
    archive-checksum: '6f253f2fce04314a518f7c710471b4c0cdb0140e5a230092c83c98d8559c2816'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `846aedc9ae344673a4deafbff76f5955bf437ec13e24f1b5eeffdf4f58603400` |
| `aarch64-pc-windows-msvc` | `6ee20cb550902ff373b55a97ee1f8a8f6cd35dc3f8201f8b8169a8a8d001f301` |
| `aarch64-unknown-linux-musl` | `17aa2e8f50269b5decfef4b09701315ed3ed8da557e23d7d6c16d9263cc455eb` |
| `arm-unknown-linux-gnueabihf` | `3520473c2a4ed07da60a0311c93017b6cedc4601ed6f223769e914b5f0d4cfa7` |
| `x86_64-apple-darwin` | `453b201e77b1ff9c1a0e0a861dc061809b2111da557073d220ee61ad2af76045` |
| `x86_64-pc-windows-msvc` | `fe8c7d5bbc2acd9dab1053948afeb8e85562ef138eca8fc2a576154a27fbf1c3` |
| `x86_64-unknown-linux-musl` | `6f253f2fce04314a518f7c710471b4c0cdb0140e5a230092c83c98d8559c2816` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.0
  with:
    binary-checksum: '200623afa8bd9409f6f604f9d06d4cc6c25eba3dc95122c47f6cd10fe54d5e28'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `a42604ad135e98818eb9b63243c8cdcbc36c1b0422eece1b5fe0b828e7c635bf` |
| `aarch64-pc-windows-msvc` | `ac6732036ecfcaa612a174ffdb63a3af8a454619f912f11473dd8884f3605f48` |
| `aarch64-unknown-linux-musl` | `c7bd60f5c51696296f1c7d443796f728d299f2466c985a7f6a4edc07e4613ccf` |
| `arm-unknown-linux-gnueabihf` | `d803f561dbaac9ac2cdc052da28f452f97919f14d7bd0415f2917deb98b1ebb2` |
| `x86_64-apple-darwin` | `3f6ee46f0e0d2ff7713254bd2945e32248800e4bfa8711250ddabeb52cf0fcfe` |
| `x86_64-pc-windows-msvc` | `02986da4e9061f49c465a4e3e782e6b1b056bdebfc95fdd52cf23dbd834681ce` |
| `x86_64-unknown-linux-musl` | `200623afa8bd9409f6f604f9d06d4cc6c25eba3dc95122c47f6cd10fe54d5e28` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.0
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
      - uses: tombi-toml/setup-tombi@v1.2.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
