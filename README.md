# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.10.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.10.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.10.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.10.0
  with:
    archive-checksum: '47c80f210c2abc54f9a4c433b768378a321a0c53fcb907cb2563fe16f277f402'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `b00ca00f24125c1fbb61c8a7940ebd56f78e390878f11cd43235e38d07426832` |
| `aarch64-pc-windows-msvc` | `c6e4200d5818e631fe0c9bf38f1925ffb18f1f0412cf0cb4a4f2812b1a11594b` |
| `aarch64-unknown-linux-musl` | `90950a01c67c061a0bc1d8180ef93bf9e741ba8d22a575c3efa0b943d4676516` |
| `arm-unknown-linux-gnueabihf` | `4f010d6979aa06a68bebb5c0ea0b27470e740348a446f1a00c597254353083c0` |
| `x86_64-apple-darwin` | `dfa9fe9d214435b41d6d4ccefb9ed878990349a2ee0edcd7e53dd05ef4e84a8c` |
| `x86_64-pc-windows-msvc` | `e92d0f276682fb4ccc30d0edca4760151e4ddb0666b4ed71f0f59ac69aa42418` |
| `x86_64-unknown-linux-musl` | `47c80f210c2abc54f9a4c433b768378a321a0c53fcb907cb2563fe16f277f402` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.10.0
  with:
    binary-checksum: '3e2d7d171267193ce55fe8e0aac35c5d300be249551c005fabc95494ecc1eb44'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `4ad846f935db4844cca1ade4c367e721a70e45cecb42d7fdbbb154968d0235e6` |
| `aarch64-pc-windows-msvc` | `f632d20f1bc956f21687d61500900854be667a293d9145e800a74d846d90a3a6` |
| `aarch64-unknown-linux-musl` | `83cfec916961c366eb48334c52b0a213f05b9d2a88e500bcc995cabbcb4f765d` |
| `arm-unknown-linux-gnueabihf` | `8227fc34218ff4df39b56aa46063a5657cd5db6dbec5b877f4d14e96b1d87108` |
| `x86_64-apple-darwin` | `5b75611305f5d70e2c0adecd13c32e936fe3cad7c6673fc69fafc642389fd7b1` |
| `x86_64-pc-windows-msvc` | `6019b8e3f240cb82fc18f40f7215a0dcc72eda49d5b29c9058a0592e8de02e0e` |
| `x86_64-unknown-linux-musl` | `3e2d7d171267193ce55fe8e0aac35c5d300be249551c005fabc95494ecc1eb44` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.10.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.10.0
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
      - uses: tombi-toml/setup-tombi@v1.10.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
