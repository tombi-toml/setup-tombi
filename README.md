# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.9
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.9
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.9
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.9
  with:
    archive-checksum: 'f6094fb14fd962c9611ccd7bc73dc7e8b03fe8859fd662e022b8d0a25649b5fc'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `3e156ba88ae4228b93071d9a4548e6dd64ae0e71d476ae09ee106a0d9a6ca070` |
| `aarch64-pc-windows-msvc` | `8a618f3268cb63cadf382464118e26a67d399b1b32d2bdf346f25c71b99e61a6` |
| `aarch64-unknown-linux-musl` | `a3ce42ce0825c3ff8c054e443dd8ded013ec5a708bba02e7b4a537b287c75734` |
| `arm-unknown-linux-gnueabihf` | `9f0a05cd98e855fa286869905f50506cb238a0c683177305fb728031bcf342d2` |
| `x86_64-apple-darwin` | `6d7d545c4f33fb7e0547b31f6e0b23bffed801f9a58664563fd9e5df10f52802` |
| `x86_64-pc-windows-msvc` | `fe5ac50c502f40e3f0da3f725c47fea05716afd5785badeca04966043d6b85d2` |
| `x86_64-unknown-linux-musl` | `f6094fb14fd962c9611ccd7bc73dc7e8b03fe8859fd662e022b8d0a25649b5fc` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.9
  with:
    binary-checksum: '81f3a7bf90c825548db3ac4bd3b4359e80ebbbc2a0a4d844bc6b152348ff7241'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `ee62f0d5bba8e4d4599657c0dff9bf837f26b664c12126a77ad1702c13506e8c` |
| `aarch64-pc-windows-msvc` | `df852bcf82836c9822c89464ab04066e41fca7c35fc6ff8dd23369084648cf30` |
| `aarch64-unknown-linux-musl` | `6f1f310e25dfc47002f8da8e49b2520da68b7c54d3c0d27f9d142460fb8ad8f9` |
| `arm-unknown-linux-gnueabihf` | `a3836084061bdc7a4a2cc38edcaed0f06ccca0a787fa4c5d8c3d88ab5f5b7344` |
| `x86_64-apple-darwin` | `4e6d46801ddc20e8a54cd07a2252f0c2bfeae1ead15155754082b5f4e177b135` |
| `x86_64-pc-windows-msvc` | `0ae9741824d346de5b15db32903dd747f0a085d49be99a10a329948d96816997` |
| `x86_64-unknown-linux-musl` | `81f3a7bf90c825548db3ac4bd3b4359e80ebbbc2a0a4d844bc6b152348ff7241` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.9
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.9
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
      - uses: tombi-toml/setup-tombi@v1.9.9
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
