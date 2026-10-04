# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.7.2
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.7.2
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.7.2
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.7.2
  with:
    archive-checksum: '70d702da0bb92758469c4f85761935b93c8172598b2682d9c89d7ab383a23a4c'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `478c67124b15960f9911f5fe2b24746c0807a77378dc6d03667b701bd2ed91e2` |
| `aarch64-pc-windows-msvc` | `ed8d7e0e6eb3c143d3c3989d90f0a648b2531f8787c17a69a5502cec5fb9c380` |
| `aarch64-unknown-linux-musl` | `10f364314b03e84b8ef57421fd7197502a49d40d6c4181e73aded12df57e5f53` |
| `arm-unknown-linux-gnueabihf` | `5889b8c93967b416af47dddeec8452957cb2838379c601039e3dd3452891fc8d` |
| `x86_64-apple-darwin` | `cdbb5f7ac355a821950493296adf9c47da981bc996d6b4de5e90269bed243e27` |
| `x86_64-pc-windows-msvc` | `b5bf95bf49a8624e3fa2e7d3ee64d02fe06a42678731f1ba392abb72e161608a` |
| `x86_64-unknown-linux-musl` | `70d702da0bb92758469c4f85761935b93c8172598b2682d9c89d7ab383a23a4c` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.7.2
  with:
    binary-checksum: '68db8c14f08bd7cc9075165ee6e978853012085690ab508ec2cff138e2faf784'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `c0bd94334f31dc18a668daca0712c89bddf74a301e0ad12e8da06ef7702d64d2` |
| `aarch64-pc-windows-msvc` | `792843b48f31e5d4657e14f0f313ee601d561e4fb934c14bd2185a77253aeb3e` |
| `aarch64-unknown-linux-musl` | `13e12f742899949f9c75e4890037b6ccc046aecaea3251fd8e0249de15cbb546` |
| `arm-unknown-linux-gnueabihf` | `6790d96fff9a068431700527d916ebf9dab5ee052f42995cf6e7f5a38ed9552d` |
| `x86_64-apple-darwin` | `7fb7475b25ff85d10dfc8016a5845bc6b6cdb013bb3b1ec9728576782520b3c8` |
| `x86_64-pc-windows-msvc` | `7e4eb6981b27593a7c8dcd41f37c4ec2b81edd0eea178522c3543dae7e5c34bf` |
| `x86_64-unknown-linux-musl` | `68db8c14f08bd7cc9075165ee6e978853012085690ab508ec2cff138e2faf784` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.7.2
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.7.2
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
      - uses: tombi-toml/setup-tombi@v1.7.2
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
