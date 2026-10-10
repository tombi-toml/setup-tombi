# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.0
  with:
    archive-checksum: 'a7d803b7878e87d4a1ca7abf444103509e17d4b9b02ad20267d32d50b7500b72'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `d3584c8d17346c13d0d5be268748932e9b956b9d05ace7cfb030a4b9b76397e9` |
| `aarch64-pc-windows-msvc` | `512ff79d8b1cde90d578ac83a83832d1e7fd8e62530f681217297247b4899bea` |
| `aarch64-unknown-linux-musl` | `c8b977ba591d5233513f934cdd286c829f3715fd103684469ee3ce3cb537345f` |
| `arm-unknown-linux-gnueabihf` | `5045c10107c02a3f81c08fea498f4bed6a7788d7aa9b567cb45ab6feb61ed6f6` |
| `x86_64-apple-darwin` | `ca61d2bd1952d13bc65f975b16bb0922ae336ef578fbf9d7b24ad00f4d1ff59f` |
| `x86_64-pc-windows-msvc` | `c30b2ff0df2db157af912b4944fc256f4dd957a97fdb1e3ff0d0dd919ac604cc` |
| `x86_64-unknown-linux-musl` | `a7d803b7878e87d4a1ca7abf444103509e17d4b9b02ad20267d32d50b7500b72` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.0
  with:
    binary-checksum: '21cfe6ae9b4b921a9587b6deb0e9ac1e7b965588de0e4d0f1aa800df37d0b6a7'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `f283dc73ba4b7d0a45b3ebb69923a36079885e3987c4f70733e04259ad7bc7fd` |
| `aarch64-pc-windows-msvc` | `abb937e33cc3a242cae7c3a41ab65b7604aeeab500e19949129a1ddf35bf3b8f` |
| `aarch64-unknown-linux-musl` | `aa94689f36c32d2bd4d7ab6ad8bec26bd8f1568b52adafd820e521741304a9d3` |
| `arm-unknown-linux-gnueabihf` | `c2c0376876af2834c06803c61004e925e2a4840948413f8f3390aa54b46d82f9` |
| `x86_64-apple-darwin` | `f26d34f95e10f86ffaa506cf407a615ec9164d791f2e988a9549225bedb32a7f` |
| `x86_64-pc-windows-msvc` | `2973fc1258dd181bb810fd54da42ce8d099bae6f974c5dbc4c5ea60b1b899027` |
| `x86_64-unknown-linux-musl` | `21cfe6ae9b4b921a9587b6deb0e9ac1e7b965588de0e4d0f1aa800df37d0b6a7` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.0
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
      - uses: tombi-toml/setup-tombi@v1.8.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
