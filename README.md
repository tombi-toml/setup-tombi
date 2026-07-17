# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.1
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.1
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.1
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.1
  with:
    archive-checksum: 'e1b91ed4006e7b99af2d8b7d26df57fe154b1b50b4fe14ffca5c5ee8203bfd3f'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `912a25882f5698fe92e6e3149fa19725108f1ffd086c4bd40b2cc8eea1a4bc33` |
| `aarch64-pc-windows-msvc` | `8a5962c7d96030fb89cf6abcc6e49871dc5f54533829b62d91fcebe25d6cdb75` |
| `aarch64-unknown-linux-musl` | `d70ba2d234c56a31afb29099c130325548c498096d42929d269f26a4ecb22e02` |
| `arm-unknown-linux-gnueabihf` | `5f7f12c66673e7644b7823071dfc9dd9654e5a4dfb4334057d2492653161d9b6` |
| `x86_64-apple-darwin` | `8478f77faf33dd9c7cda342f747acab7107ea69a9d7cc39623e083b759540cce` |
| `x86_64-pc-windows-msvc` | `212c7ba34e0a939187beddd52d62f3baaf1cc2f6281532fd240e23b1f79d909b` |
| `x86_64-unknown-linux-musl` | `e1b91ed4006e7b99af2d8b7d26df57fe154b1b50b4fe14ffca5c5ee8203bfd3f` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.1
  with:
    binary-checksum: '5d9d4b6bcbcfb2cc2a64e568e502852f451ae1afe09ed41a4bafa12d00324e6d'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `4db1ccfe65a6a3d640ff9748c9cc2fb1562895289befbfa68d431f594338ba08` |
| `aarch64-pc-windows-msvc` | `fae7720eb5ecac2b6d2508bb23061de441c308d9ba6fff24659b2362eb795d92` |
| `aarch64-unknown-linux-musl` | `97259947cd35b934f2390f9a49c93b04faa3a28cf94a62c0a4646fc08790f3e9` |
| `arm-unknown-linux-gnueabihf` | `2505cd2cdb5b591484486303d4eb62fa557c5c5b80c63d4c4b0ddd08eb76230b` |
| `x86_64-apple-darwin` | `a3431ffef6f040676b0dea67a744a6027b36307a918ab49e82dd55a390945c5d` |
| `x86_64-pc-windows-msvc` | `974a3649b3201d72711e0014d0917f964b7c3b38aa17c57fbce69b936e1a927d` |
| `x86_64-unknown-linux-musl` | `5d9d4b6bcbcfb2cc2a64e568e502852f451ae1afe09ed41a4bafa12d00324e6d` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.1
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.1
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
      - uses: tombi-toml/setup-tombi@v1.2.1
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
