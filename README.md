# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.4.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.4.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.4.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.4.0
  with:
    archive-checksum: 'e2dc1190e0590b1fd0581fa8f85017215ed9b05a4d85c1cf18e0979b6cf24fe1'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `248159d26488f11fe8c36b9239b1ab84abe3533f4a5d8d066e56c091a99ffde1` |
| `aarch64-pc-windows-msvc` | `b8fa7ef33f86f011716d9a5712084ac461f83147c312436cadeb15dc7af67029` |
| `aarch64-unknown-linux-musl` | `b70750d462954294c354a014bb90399273876b953c21e3a136aafd3d1d41f5e8` |
| `arm-unknown-linux-gnueabihf` | `33e4074c0ba027024d5689bfe09eed42d9564111922c3cfeb92ba8f04380ec12` |
| `x86_64-apple-darwin` | `7016e0028bf0ff122faeb49b0bb248c9d73885ce73b8ada26be6248e207977bc` |
| `x86_64-pc-windows-msvc` | `376f26ef04c32b7de57352fb1572d550d2f728958f00bfa585cec94a1df677ab` |
| `x86_64-unknown-linux-musl` | `e2dc1190e0590b1fd0581fa8f85017215ed9b05a4d85c1cf18e0979b6cf24fe1` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.4.0
  with:
    binary-checksum: '7e4508f8709bc38e5d4e8d4585c8c15a4071ef96f9f89ed9a1da1786e241e9f2'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `2740a56ff7d6dc32a48a6001aa5fe296062ff01291181a8f68d5a6c899a424c0` |
| `aarch64-pc-windows-msvc` | `451b4300d951f9f98c751c5a66c1d59ef728c79d3291b4d348af1974e6912469` |
| `aarch64-unknown-linux-musl` | `0531412386c10b740d0456dfb6dbb0474383719306f6dbe2fa0a8ac456180a5a` |
| `arm-unknown-linux-gnueabihf` | `989d371402177c2ba4ccf9655c55cf9540863bc8c82a1ec0d1ad5336eab3aa77` |
| `x86_64-apple-darwin` | `1ec8e5a8d94e3be91275b9d4ad28486aead1031e7bc4e88ac8f3715488b64710` |
| `x86_64-pc-windows-msvc` | `65d831b1601f68d98d7367fb13d55ae0acf8018bee5392bd4f7fd977167efc0f` |
| `x86_64-unknown-linux-musl` | `7e4508f8709bc38e5d4e8d4585c8c15a4071ef96f9f89ed9a1da1786e241e9f2` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.4.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.4.0
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
      - uses: tombi-toml/setup-tombi@v1.4.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
