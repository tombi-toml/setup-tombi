# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.6
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.6
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.6
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.6
  with:
    archive-checksum: 'a845f9275c83ee8ce408cc16fee11a7dbe5009214a4b92f2bbac5c0aa3afafe3'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `e3e29db219a07e2e8534735a61c340f1bb3ec1bee845a4fcd6d72f59e0e9383e` |
| `aarch64-pc-windows-msvc` | `c86f4926776c251f9d82946c470f6c33d61a597d055bf1861d3630a38cab9f59` |
| `aarch64-unknown-linux-musl` | `e29f2af283d9c090c7da16468406ffa5b7183d06cefeae19da40ac6d70ffc42c` |
| `arm-unknown-linux-gnueabihf` | `7dc3a82328c8d0acd07f20bdd4a333bf48699cebe6e90cd6800780794d32f547` |
| `x86_64-apple-darwin` | `8f9b2e3ba04f2d2773b15211024233a89d6ba0e1732c6b9d0b5f98a06ab2bd75` |
| `x86_64-pc-windows-msvc` | `6080696714182be2e35bd89e3bbe4f301f92fb2cb888088fd282c341a4f1e5c1` |
| `x86_64-unknown-linux-musl` | `a845f9275c83ee8ce408cc16fee11a7dbe5009214a4b92f2bbac5c0aa3afafe3` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.6
  with:
    binary-checksum: 'a86f0febb3bb8896b88e9a19cd900e42c181bee85010d0d71cbffb6c425b888b'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `bee6c1dc3746c87413ae6f637053caaae16922f8f45037ba0ac3c3f3d4498670` |
| `aarch64-pc-windows-msvc` | `902406272b20e8de9167dd39d930ab7d205b959c048c3b6289263be8e030b2ff` |
| `aarch64-unknown-linux-musl` | `9f9ce1805d628234cf1cf2d0c634fa3885ed081a9e71a1535793743177aac3e1` |
| `arm-unknown-linux-gnueabihf` | `fbd5f0e4a06b02d08261678966230dffc0bb07b3d55279653876d666073387ef` |
| `x86_64-apple-darwin` | `20c9350a0a724e712afe4ab3e3239e70d735c487a2ba6bad845437100b29d3bf` |
| `x86_64-pc-windows-msvc` | `3547a4dc1ec2e6a314129bb631f63cf106071aed1920223afcbe017a4d15dcaf` |
| `x86_64-unknown-linux-musl` | `a86f0febb3bb8896b88e9a19cd900e42c181bee85010d0d71cbffb6c425b888b` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.6
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.6
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
      - uses: tombi-toml/setup-tombi@v1.9.6
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
