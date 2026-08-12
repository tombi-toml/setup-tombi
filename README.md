# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.3.4
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.3.4
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.3.4
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.3.4
  with:
    archive-checksum: '61ffdd6c87da426004fe463d94d4ddeb72b9c53b6026d9acfe218fac6be14610'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `6c0715cf9b5be3f4506a5c20979a3162b08ece6406bb2942757ee68e8ec5280e` |
| `aarch64-pc-windows-msvc` | `2da18d2d512a6ef14b8713ff90f14d41a5503cd49d3b7ab44090c9abd337a354` |
| `aarch64-unknown-linux-musl` | `a4a256a81a346cf931013d5bc88e8bf3c1517c83a809f6baac3f34859d9a01a3` |
| `arm-unknown-linux-gnueabihf` | `04385b797fa19e7a3bc58f1f5ef4fa3dd3d20435ef9585d527175272b75e5c12` |
| `x86_64-apple-darwin` | `3eb28bf76f23ef71f8b3b01ed71c208571a54228f13382043b4588fb5763c455` |
| `x86_64-pc-windows-msvc` | `f68b9792947ee9971c72e6156f562550141856ce6285db5ddb67172c611561ed` |
| `x86_64-unknown-linux-musl` | `61ffdd6c87da426004fe463d94d4ddeb72b9c53b6026d9acfe218fac6be14610` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.3.4
  with:
    binary-checksum: '9f0f57fc0929eb5bcc0f0b0c2b950ae7a05a5396b03f92f83783448b5f201c31'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `c6163cd66856ba5e54f9f3917d47429bcd4cb9cf737acdb63d606f6fc42d1600` |
| `aarch64-pc-windows-msvc` | `6976b27259e465edbf2e6b0ab38350cf4f3f0e16f690a789200a34a6e2afdff1` |
| `aarch64-unknown-linux-musl` | `dfb6ce9e07b408bb61497ea415367942e0a784796300cb4a84bd07ea65078db6` |
| `arm-unknown-linux-gnueabihf` | `b1b67a0f3f00bb2f94e9a706e7d355868dc6cb030158d6ac8789150ecc6d1cc6` |
| `x86_64-apple-darwin` | `b2fbf95aaf0b4d98c6b472e745808e1004795be9516d8c6269ade66bfc0dc056` |
| `x86_64-pc-windows-msvc` | `ddd856c11f4bfecb6925a2496e336cf436247f0dce65b97412e489688d0894a3` |
| `x86_64-unknown-linux-musl` | `9f0f57fc0929eb5bcc0f0b0c2b950ae7a05a5396b03f92f83783448b5f201c31` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.3.4
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.3.4
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
      - uses: tombi-toml/setup-tombi@v1.3.4
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
