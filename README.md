# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.0
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.0
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.0
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.0
  with:
    archive-checksum: '440381b5d3ea67d325c6b4c4b4d0c681bc4aabd3623f31fce379a30cec6694db'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `0e14d1f61ecfba7dd22fce1417be4c1c0428354cfe7e5b2756a2fe36424e15f1` |
| `aarch64-pc-windows-msvc` | `cfef2b3c79a971bd2d5d3b0af63e092fd8d1c414afdea56ccb97d6f3b5ff046e` |
| `aarch64-unknown-linux-musl` | `963e8d91a7b5517071837971dc7c60a84f766038ea4467a5c3799a511413ac78` |
| `arm-unknown-linux-gnueabihf` | `92f02beec467b293a51f6ce97d1a5785c8cea360e0d69af97991658286f4c47d` |
| `x86_64-apple-darwin` | `ba2966ea709a3b1417f3cae9506880642306426fec7c970dc0202882e2634593` |
| `x86_64-pc-windows-msvc` | `6566cd1a9d87d83e905bf2aa9b72858dc66e21dc949b9ccf3a09447155b21245` |
| `x86_64-unknown-linux-musl` | `440381b5d3ea67d325c6b4c4b4d0c681bc4aabd3623f31fce379a30cec6694db` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.0
  with:
    binary-checksum: '81348ae9f1246c87ea50720a3d4a395b1a57e86daa745c639f587cef06cc0b17'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `965b675a247da1589de247fe17088a870cc735cc922448d450bf93919a3f0197` |
| `aarch64-pc-windows-msvc` | `a104c696ef511b7ac9ffaa174ca02640d4d897c67761c5e384ae10fb7e14a35c` |
| `aarch64-unknown-linux-musl` | `1bee5f3929f85583d2ce25ffd2ccbe95fb1ed0761781e6f9a7e019bf7d242e3b` |
| `arm-unknown-linux-gnueabihf` | `e1eb28aee438ccd8a2edfd89a9ecd36f8721dca5b1b9403e26a588d87ec3bfcd` |
| `x86_64-apple-darwin` | `7e86a77b975be12766d1520fc487cb57f2b3c389171a8874c43fa200b3dd5ab3` |
| `x86_64-pc-windows-msvc` | `8c7f93af60d78b9081a7d6a5a4dbdb3cfe2b3a64d55bd81e53b3dff121f31076` |
| `x86_64-unknown-linux-musl` | `81348ae9f1246c87ea50720a3d4a395b1a57e86daa745c639f587cef06cc0b17` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.0
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.0
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
      - uses: tombi-toml/setup-tombi@v1.5.0
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
