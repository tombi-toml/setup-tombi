# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.8
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.8
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.8
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.8
  with:
    archive-checksum: 'cf51b0f134e5b488212bb062538e0381a163a4f7db2330c58e3cf613637b3118'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `7d07cad962ad3de96113b92f40fbb59617a9214f263027c14a66fd08b61289ec` |
| `aarch64-pc-windows-msvc` | `b5830cfa77b11ff75f3938b41a1a525181a9de7f965fbd8c716f48fd80ee4f0f` |
| `aarch64-unknown-linux-musl` | `696d6b934fd0c4fa002ae905dc72a551d54677d9caa7b272adee3ea27e056307` |
| `arm-unknown-linux-gnueabihf` | `f86b5a163a783c9f39e168ef391935717074feb38e53403283ba6dd6362853eb` |
| `x86_64-apple-darwin` | `627ad53b286a48aa379a9d59648506266e5640df7b9936a416d972d4efb823df` |
| `x86_64-pc-windows-msvc` | `df4be8cac00b00c5b0d421723fc25c959539a355a1407ac6ec97c9d30669c622` |
| `x86_64-unknown-linux-musl` | `cf51b0f134e5b488212bb062538e0381a163a4f7db2330c58e3cf613637b3118` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.8
  with:
    binary-checksum: 'f66338c7a729c00811c9e52c8f24f93a73b64343a61bd026e069f706f81d59c2'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `7775f423352c1ed20117c3f480aff8b6f2a73bda9f0f0b03e7a8cc785064b738` |
| `aarch64-pc-windows-msvc` | `b58a0ec3c4e07bcb2065b371a4f6c1b0560f832d439cc5eeffba9f49e219f5c9` |
| `aarch64-unknown-linux-musl` | `48dafdc4262b4c6ba618723240bb550891b87b486ebaee6c33db28e694bb1edf` |
| `arm-unknown-linux-gnueabihf` | `78f182d8b4e9aa906a056de1bd9e37c92997c0c59c80a8d95e1127837f9d7d30` |
| `x86_64-apple-darwin` | `32e51c1c506afad1eb1467ce6d0fe46a1af5729451a78c1a37e784802f614725` |
| `x86_64-pc-windows-msvc` | `de04e3779e5ad5c226ecc9a10f0349ea4a8f78d741de3e12bb24049e708b6a97` |
| `x86_64-unknown-linux-musl` | `f66338c7a729c00811c9e52c8f24f93a73b64343a61bd026e069f706f81d59c2` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.8
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.8
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
      - uses: tombi-toml/setup-tombi@v1.9.8
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
