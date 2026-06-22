# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    archive-checksum: '533d47fe516468fa0abc245050dbc120fcbfa4399fdbfebe863758dc9d95f5fe'
```

<!-- checksum-version: 1.1.5 -->
<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `bb6c09efabc5114d6ae7e188fc72ce28e2b8e378f79835d5601e6bc038bca0ea` |
| `aarch64-pc-windows-msvc` | `1a184c261ca5a6b817d8ef7f5b3104751b1e2171afa45c0c59ac5bb740b12846` |
| `aarch64-unknown-linux-musl` | `32cde3d006175407f44535770747b4629c27776fde62a0cbb1f891e8361526dc` |
| `arm-unknown-linux-gnueabihf` | `1d9a4265a6457e4fbdbbdbeea1130dca94c6205b1d100d23eaee48ddd4f9579e` |
| `x86_64-apple-darwin` | `c9c4328970fe46f17edbafea4b4880bfa9e7eaa8baab9baf0813a47e99af452e` |
| `x86_64-pc-windows-msvc` | `c6a4234c17cff35f6ab687b35bea85d63bb1b91c96a70bde043bd1c9dc260dea` |
| `x86_64-unknown-linux-musl` | `533d47fe516468fa0abc245050dbc120fcbfa4399fdbfebe863758dc9d95f5fe` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    binary-checksum: 'd7f7ad16b0d0bdca260836beb3fb3795b306bb7ffedebd359648c07eec2dca92'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `b8998eb4f69d3d4a0f24b6a5f210cccf8ab025acfeadc110bc063a780e52e14a` |
| `aarch64-pc-windows-msvc` | `605c4bbe89e479162866525677c0e027fb429bf2aaf1e8664a3362fc129c7eab` |
| `aarch64-unknown-linux-musl` | `a5f58be1200a4fdb7e20aca5a8f0e3fd57a2e98d02e5b8be26cb32db93d19913` |
| `arm-unknown-linux-gnueabihf` | `a90220757f1eace3214f4187f7ea7eaf8a50209c1ba72ef41dfd76992ca5c2a7` |
| `x86_64-apple-darwin` | `5fdb6fabbb1d416f00ca6efc93f7e201b7bdc012dd151bf58fa4b2aa783761e5` |
| `x86_64-pc-windows-msvc` | `32da7d9c080379a15f0275bbe0638cc477609bb975ed1b883e9d4964f8dbe9a6` |
| `x86_64-unknown-linux-musl` | `d7f7ad16b0d0bdca260836beb3fb3795b306bb7ffedebd359648c07eec2dca92` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
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
      - uses: tombi-toml/setup-tombi@v1.1.5
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
