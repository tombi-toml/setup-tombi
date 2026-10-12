# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.4
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.4
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.4
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.4
  with:
    archive-checksum: '597e08f9fa336b365c011c94387997dd3d2dadd904cde5b7dc55033d29680e5e'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `ec873e21e7165007d4ba785c817b2ffd26b3833396bdbf80cfe49540d45f08f8` |
| `aarch64-pc-windows-msvc` | `a9c7918b9e889ce913c4f996e56df24801a4d7e0953d725e42ba8600a5f4daa7` |
| `aarch64-unknown-linux-musl` | `681003a505bfb40f79ec8e833dda0d5c03e5f43c4c362f494ee8d6652775c73a` |
| `arm-unknown-linux-gnueabihf` | `b50a4c89099f160f5bdb98e75a621a6499ed5b222b655fee1791537c41139d8d` |
| `x86_64-apple-darwin` | `fa3d7fca1853c27da005795d51fed0ec311de7d9e2a795bda5efc87191d21fb8` |
| `x86_64-pc-windows-msvc` | `11809d18477d7ac952110dc3e8423533ff480915f780add1e589e1d27493b61e` |
| `x86_64-unknown-linux-musl` | `597e08f9fa336b365c011c94387997dd3d2dadd904cde5b7dc55033d29680e5e` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.4
  with:
    binary-checksum: 'f9c00c40447f4bb3af4bc31ffd7cda7fc8ad5c1065f93fa1b93ebcf7f92fd823'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `6613db1a65c16eae4788eebe6eb30cdf2cc0fb0785b5cef6c35d1ed5f490cb78` |
| `aarch64-pc-windows-msvc` | `8522ecd2850af45f25201075feeb64c6c6106009e5cc3008d2ed60be228de8b6` |
| `aarch64-unknown-linux-musl` | `d89f763cc9a40491cd058ef49644db16540ee2a86ca7548c4c7f776dc10dddce` |
| `arm-unknown-linux-gnueabihf` | `363514e4fb915b7b07e93d673af7d6f7c658f3672516fdbd8691ad2febf8d71d` |
| `x86_64-apple-darwin` | `b6a25521755b7945e8d30518559d39f1127bf7ad9aecd600f2e831d6eada10c3` |
| `x86_64-pc-windows-msvc` | `c8a5b686d38b996b2ee426ece89710d0af9e6fbc5bc001dd420b778c59d0e084` |
| `x86_64-unknown-linux-musl` | `f9c00c40447f4bb3af4bc31ffd7cda7fc8ad5c1065f93fa1b93ebcf7f92fd823` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.4
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.4
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
      - uses: tombi-toml/setup-tombi@v1.8.4
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
