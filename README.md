# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.3.5
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.3.5
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.3.5
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.3.5
  with:
    archive-checksum: '343b19cc8e61f7a925c8fa82af61f06df2f9f8b7c05fa7bf4e48f1925662a4fb'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `966cf59b974160c2529c5c7ea21159d560c4af79e563567fc09614be2c71a4d1` |
| `aarch64-pc-windows-msvc` | `3b49f24e8ffe71afaa8175fc55f9b4d2caf1f53e6cc483640587d921aabab232` |
| `aarch64-unknown-linux-musl` | `ca2dad63324d9660422f321b46fda3143b59d2d9cc5358816d709af6459f61cb` |
| `arm-unknown-linux-gnueabihf` | `c38189cac8e28d10102000991c3995b07de67a959565753f6a852a18ab8cbb1a` |
| `x86_64-apple-darwin` | `bf9186bee4b5ce1ef24151d3505b0f3e6a91ad0fae201909716b652656e13418` |
| `x86_64-pc-windows-msvc` | `1f8602106dbffa42e4d7aee60fbd8a0d48a467b3ef7d3e50cd25570e9d7891cd` |
| `x86_64-unknown-linux-musl` | `343b19cc8e61f7a925c8fa82af61f06df2f9f8b7c05fa7bf4e48f1925662a4fb` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.3.5
  with:
    binary-checksum: 'c774e81f846e1a9c74df2f5030ecaac5d32bc660eb290622ebc785d541a7be03'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `48261326e8cb95c0c57727ec85d11a180d71a3fc5f45e1ceaf33bb0f063ce7a6` |
| `aarch64-pc-windows-msvc` | `d361101a1ad5473645741d6db381614d8e4afa8d2ae22dd404f501ec6871b827` |
| `aarch64-unknown-linux-musl` | `95f5d916363d6929cd57bb9c7593cf7a0f5fc5966494d88d961059a8f39c4195` |
| `arm-unknown-linux-gnueabihf` | `e7f67bfca6dea3f8f710904f6fc6a20375c87c9a8b539df158f14c27f41366d1` |
| `x86_64-apple-darwin` | `8dc7d0fcb2b72e913915e1d277f32298c5014cd0178510a14f7e41fe29a2635f` |
| `x86_64-pc-windows-msvc` | `b6921088ada1979f77928ec462c80c390a2c3d70bb1c45cc7794539d48a65253` |
| `x86_64-unknown-linux-musl` | `c774e81f846e1a9c74df2f5030ecaac5d32bc660eb290622ebc785d541a7be03` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.3.5
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.3.5
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
      - uses: tombi-toml/setup-tombi@v1.3.5
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
