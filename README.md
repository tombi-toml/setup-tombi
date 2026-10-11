# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.1
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.1
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.1
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.1
  with:
    archive-checksum: '593875e0454dfb58afa3d3c7728d8fcfae25ba2c0dde85b75b4f84a84ba3224e'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `a6b4580f204fb51ad2981afbfbd848b0b083ed5be6b27e5af6fb0ca40cdd1f3d` |
| `aarch64-pc-windows-msvc` | `a026217f6350accb7ae67345eabb50962305e95cdb7d0510a275efe41b9d49d3` |
| `aarch64-unknown-linux-musl` | `9f01b11acb21801fa85d37b8c90346e42bb9d0d7fd8ded18555349d783d8bfc8` |
| `arm-unknown-linux-gnueabihf` | `97b75755440113902ccea80266f6e9b95f30f23164b62574dc1ad5641ff51c42` |
| `x86_64-apple-darwin` | `fe23cc167160746f5f67a1f0f433c09941733be1edfb3980dbc2ecb657e24eef` |
| `x86_64-pc-windows-msvc` | `bd968e24a271ead008fde44263aecb3fded6669ce518d3ef4c33148e024013d2` |
| `x86_64-unknown-linux-musl` | `593875e0454dfb58afa3d3c7728d8fcfae25ba2c0dde85b75b4f84a84ba3224e` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.1
  with:
    binary-checksum: 'acb1e986fe079a7c08bc455cad58f6b3a565f803c0c86d6566a4e07cd70a3be6'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `19b8ace74213bf186aa6166c3ee51bf00959c95e044e6975b0a2903367a3ed98` |
| `aarch64-pc-windows-msvc` | `eee02a280732ea81188efbd20b0ac3d96ec5c0c60a1ad022f289fbc0b2b84b04` |
| `aarch64-unknown-linux-musl` | `7eb738a46798f30f32a2fadf0d5e5bbc5a86ad04d28de83371adf9093bb97c53` |
| `arm-unknown-linux-gnueabihf` | `85da192bd883b0564ec21c861feac1a6ba382c324cebc66769c34d5354f37acf` |
| `x86_64-apple-darwin` | `8e4749df67739622d82103a05d05598e582ccf33d33947ff84bb4c48a03ddae4` |
| `x86_64-pc-windows-msvc` | `773cc83bd5433f8f746c673e4110a4ea279969890897bf2acf9b8655ca498a12` |
| `x86_64-unknown-linux-musl` | `acb1e986fe079a7c08bc455cad58f6b3a565f803c0c86d6566a4e07cd70a3be6` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.1
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.1
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
      - uses: tombi-toml/setup-tombi@v1.8.1
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
