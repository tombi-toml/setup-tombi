# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.2
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.2
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.2
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.2
  with:
    archive-checksum: '3059ea11aa14c3f836538c70c3a50d22d90f5d47f59c198dae90e8049153c1fb'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `890fc24cb7da3b3eadc57b5960e593a3329b4d50663d374497b4f217a2eb0858` |
| `aarch64-pc-windows-msvc` | `6c0907c2be7bfebc60ad34986e37357c21840c3dd92ad25c6be19ee2cd145fd4` |
| `aarch64-unknown-linux-musl` | `c79801e5fd7fdb77573dd4dbe2c5f56b4f7a610c1da044c57e1a51c2cffeb3c2` |
| `arm-unknown-linux-gnueabihf` | `029decaa50af049a1cc45a3093c32e55e4b4c3e6f9af7fce56bcdede5406dd13` |
| `x86_64-apple-darwin` | `5a86377a76517c62de9462705594113afa5e33d7464beaae20397cc23f86394b` |
| `x86_64-pc-windows-msvc` | `66cd95c36cbfea4cdfcf9f788467048bc3b008801e27c6604558347906d130ac` |
| `x86_64-unknown-linux-musl` | `3059ea11aa14c3f836538c70c3a50d22d90f5d47f59c198dae90e8049153c1fb` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.2
  with:
    binary-checksum: '5c90cd3e0f18230db140fbb4e21938a73d92b3c0617b54309dd503e1f9da62c9'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `71c8d41d5375c39a5ec688359726f2b70104d0c065e29af237a475432950363d` |
| `aarch64-pc-windows-msvc` | `3ba0c91c4b24df25aecf09aaeaa3546fc07cf01f3668417e099abdd364abcb79` |
| `aarch64-unknown-linux-musl` | `f3d4210af3c32b19a822b55f6b5d24eacd266305a81cf2ff5119513ed3b63acb` |
| `arm-unknown-linux-gnueabihf` | `a023f93ea6fb7bc6ece4e644c12a5b0c035249f0cbbac2134a6995252a9eb244` |
| `x86_64-apple-darwin` | `055f9f0ac6047ed3e137b21095701719869d9dea5af6025b621cded27ddf81d7` |
| `x86_64-pc-windows-msvc` | `e94f1d24061cfca7b77e06a6b911b810a991b5399411338b2f1f76791422c960` |
| `x86_64-unknown-linux-musl` | `5c90cd3e0f18230db140fbb4e21938a73d92b3c0617b54309dd503e1f9da62c9` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.2
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.2
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
      - uses: tombi-toml/setup-tombi@v1.2.2
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
