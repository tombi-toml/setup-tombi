# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.8
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.8
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.8
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.8
  with:
    archive-checksum: 'be0f539e0474d250f77fa8fae845b4507036f5b95da782f9fc1d9f6a97c5bf30'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `e1d5a8649c4dcff8a18f97a84df2aaf733ce6d463380eb316d2e4d57e238bf2e` |
| `aarch64-pc-windows-msvc` | `53839762076412f4d3a0f5e0d623a620f8d2607787e739d88d38f639974aa64f` |
| `aarch64-unknown-linux-musl` | `e1861e75a1796d88f9a33799229bc972179a44f2a7bebc666f33ee7b3d44474b` |
| `arm-unknown-linux-gnueabihf` | `005889114d1cfee36711f4c6cc4bd216ab1551a57c798ad1be38d7fa92403c06` |
| `x86_64-apple-darwin` | `88d949d3eeee483d6423e3c12f5c44d7b5b59397cfa4240ba02d423af11e70d4` |
| `x86_64-pc-windows-msvc` | `3af4fbc3b42579c795d7b3a7a3bf04d8c59c203569d9194733f7ad56f1c31c18` |
| `x86_64-unknown-linux-musl` | `be0f539e0474d250f77fa8fae845b4507036f5b95da782f9fc1d9f6a97c5bf30` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.8
  with:
    binary-checksum: '048e6a51058f0df9b71ea274561cf58f4546f2467f601d2001daa6e851556c0d'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `443a4016f48baf59a627f09cda498bc648c83ad61b0b4f9745084cf6183c179c` |
| `aarch64-pc-windows-msvc` | `3cbbb2f21dd1249e233becc24e3801537ba86fe242ebaed29265c91fb0067456` |
| `aarch64-unknown-linux-musl` | `1a0a0e73094ab56994be8d6df23fb87b6e6be37b0804ee98363f302e1c887a0e` |
| `arm-unknown-linux-gnueabihf` | `20ed31927a0547eeb5c10a0dc47b9fe5091c258c1d51909ff78bcf90a17d7cb3` |
| `x86_64-apple-darwin` | `33c76dedad84c39d96027d3bd8ada0f432fa2e67237d5c02a83c36657a142cf5` |
| `x86_64-pc-windows-msvc` | `9b711e5175259bd1a982d64f9826b6c2399bd04478011813723197d54e11e564` |
| `x86_64-unknown-linux-musl` | `048e6a51058f0df9b71ea274561cf58f4546f2467f601d2001daa6e851556c0d` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.8
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.8
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
      - uses: tombi-toml/setup-tombi@v1.2.8
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
