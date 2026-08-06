# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.7
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.7
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.7
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.7
  with:
    archive-checksum: 'f7353252b12d0132eaefcd234890d478580e60e13fd9b4a7a918995acfa2c139'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `d9d73bf090b447bd631767fa68aefd1ad5dab46ee9607e4f4b3dbf291c4edce5` |
| `aarch64-pc-windows-msvc` | `fa865418630b436266cc3f529cddcd1cd00339cbb2ae710ffb7ea4cd11f34024` |
| `aarch64-unknown-linux-musl` | `f09256852be93b1b06596dfad1a5b2717b4ca78d33e487d817caa94fef729381` |
| `arm-unknown-linux-gnueabihf` | `292142b8de630b3e09d83f4072850bf89960b45a21d0631568f49d918b88a3c5` |
| `x86_64-apple-darwin` | `39a0efc27a07f16cd7f7bb930bc993ba2816b4a52c4db7e00f140fee35ff7194` |
| `x86_64-pc-windows-msvc` | `81987e4f5cd25cb57f9d46e9a353ef1226869fbf9b2c889220a67d420bb4f0e9` |
| `x86_64-unknown-linux-musl` | `f7353252b12d0132eaefcd234890d478580e60e13fd9b4a7a918995acfa2c139` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.7
  with:
    binary-checksum: 'df4d58bc24cb0060cca9b48a93906dc2272c74318449de6401ff6d117c93f509'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `2c0e967f3c7ca348a2a20ba8527ee2262c000abdfb4208ad99f3847a14a75457` |
| `aarch64-pc-windows-msvc` | `770559dfaab37e36688b756ccabb69922796ac9f71c631f75beb4532ccbebd03` |
| `aarch64-unknown-linux-musl` | `e59218b05c19146135ed05fa69e1b1edb6d0e990cab65acc3fb5abc64a7aeee4` |
| `arm-unknown-linux-gnueabihf` | `d04f0de1d2a37809ac70df3ac2616330cbebdb2a790eca299f4732853cab9f6c` |
| `x86_64-apple-darwin` | `dee3d638c9c9666907923f868d4d7ff691364e7a0cb409fc10e1bb2e34c2e20c` |
| `x86_64-pc-windows-msvc` | `f8221cc03def3245c0bba930b6dcd704a1569cd50a7c7d2d49ad11cbf2d88679` |
| `x86_64-unknown-linux-musl` | `df4d58bc24cb0060cca9b48a93906dc2272c74318449de6401ff6d117c93f509` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.7
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.7
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
      - uses: tombi-toml/setup-tombi@v1.2.7
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
