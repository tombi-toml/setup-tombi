# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.11.3
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.11.3
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.11.3
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.11.3
  with:
    archive-checksum: '36672279d05f093455f01fa5a2799a8cc2162a9195cbbb23f0f8d1107d0de497'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `4e7daae9197910fe3717d241e5ca85cafd0f7f0ead988056fdd0b2cf2a447600` |
| `aarch64-pc-windows-msvc` | `621bf39b23546ecf9b2b4759f4203d6c5040a40ccd2abe17fa731999de1f81f0` |
| `aarch64-unknown-linux-musl` | `083614471a69e15f147ba68c96fe1e3ea02e8efe38d6bcdb4606b5a37ab8758a` |
| `arm-unknown-linux-gnueabihf` | `a716f5ede403c14bfdc073fe589abc0173b3b6ffba336545f90a13129a5d8180` |
| `x86_64-apple-darwin` | `642900713c3cb04adf45264117649e5f4731395b62cbafee8a9a2824fa479684` |
| `x86_64-pc-windows-msvc` | `b6b2d9e6419216aaa0b8e74a5c81c48335cb193d6eb87f50a7d77468bce10073` |
| `x86_64-unknown-linux-musl` | `36672279d05f093455f01fa5a2799a8cc2162a9195cbbb23f0f8d1107d0de497` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.11.3
  with:
    binary-checksum: 'bad332bde2c303fb1e55c16dc724232ea61bb4481726379dd58047a7d2f1a859'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `7dac5df7f24ba43ae72941dc3c059607b52b0ee8ef21cf1347f0ab94ef504685` |
| `aarch64-pc-windows-msvc` | `977be7b3851bb3de3d78768f30217801b5e42dc3f0368f10fb24ff9e95cec4f2` |
| `aarch64-unknown-linux-musl` | `79b5899dc84d7817eb1c3a4bb4abda9f181a1d5eeb28d92bb4af1b61c30df8e0` |
| `arm-unknown-linux-gnueabihf` | `a39228c7e673be0b9f43323a6c3203a9e157c08a90fa0b34013292e2ace9c9a6` |
| `x86_64-apple-darwin` | `901b8419d148d51bb43fa36f8151133f4f1728e5186d208d63f025f508603c93` |
| `x86_64-pc-windows-msvc` | `eeb9def760793cf1126fa38108c8cfe2df7ec224c8ec197ac94c4bd7fffd96fa` |
| `x86_64-unknown-linux-musl` | `bad332bde2c303fb1e55c16dc724232ea61bb4481726379dd58047a7d2f1a859` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.11.3
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.11.3
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
      - uses: tombi-toml/setup-tombi@v1.11.3
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
