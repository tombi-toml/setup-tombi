# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.2
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.2
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.2
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.2
  with:
    archive-checksum: '871aa9cd9e9f54da46f8b4e7318c5b9777ad18f46745071f1c693d352c487c9d'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `ad84d0b2185fbab7a8f3629e826b04958e86f3cfe65a1348753b02b3b1bcd3af` |
| `aarch64-pc-windows-msvc` | `6908fcc3167483b85f2e321a59afaa2dd1ccda876859ebd242756328597061e2` |
| `aarch64-unknown-linux-musl` | `ee653d9b5a8421d68a3abd8abc9c1a633e6a21adcc13dfa59992c8e4baa56353` |
| `arm-unknown-linux-gnueabihf` | `bb29d016d8bbb21c832c0101db6c614b5ca0fb7f44cb2088b2926bfca1339eaf` |
| `x86_64-apple-darwin` | `a54500ba300d283a2431da46aa39a7b9b0dde1396a9694d2e5149fb6017d3966` |
| `x86_64-pc-windows-msvc` | `9607cabb2cbbc81c92af06e2005dedcd625dfb0e50e511d2eee8d90495c6ae5d` |
| `x86_64-unknown-linux-musl` | `871aa9cd9e9f54da46f8b4e7318c5b9777ad18f46745071f1c693d352c487c9d` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.2
  with:
    binary-checksum: '63e3c93de0671babdb01207002bcfedae6c47d9f9b74b1fb2fbb04646204d44a'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `c9351118ba8bd83910ad2d9a50abc3c6c2e2c70720cbc5e1b8ac5e1bdd19e633` |
| `aarch64-pc-windows-msvc` | `62f5c19f752eb05dd11d669ded6a3f34c1bc84f9966eb49d3a8f7deb7a5a5ae6` |
| `aarch64-unknown-linux-musl` | `d108fbd9eefd135293e03b4063d056338c883d72d4ea4bce161ed9101b5f2f7a` |
| `arm-unknown-linux-gnueabihf` | `e1584bee2040b8c27fef6c065c6f65ec5daaf4c13778b562da5f412514800ad4` |
| `x86_64-apple-darwin` | `cc0cdf0c546cb3938fd2dc28cdeca5109ed139c058edcf11baa758983f1e2d0f` |
| `x86_64-pc-windows-msvc` | `e9b8bf2a7ebc8f4767a037a48cd4ce9274f9816891f1fe93b73b78006192fcb5` |
| `x86_64-unknown-linux-musl` | `63e3c93de0671babdb01207002bcfedae6c47d9f9b74b1fb2fbb04646204d44a` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.2
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.2
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
      - uses: tombi-toml/setup-tombi@v1.5.2
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
