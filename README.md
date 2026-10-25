# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.5
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.5
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.5
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.5
  with:
    archive-checksum: 'fb79625deb47b4b5f1e5ee07dee019348acefde61cf823ddbbf8b8a30070048f'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `ecaf3f4d1f9789a0684f1755b1466a2146211a2cb490693579c0fbc8268a9525` |
| `aarch64-pc-windows-msvc` | `eb49bbe99be8a75918cfc5390cd3956fdf22b88b80783f2b3d3629c7c3a93181` |
| `aarch64-unknown-linux-musl` | `2267922298dc2ef6a6ef85e791eee6fc5332c8d9fe3159847a8ca4bc84808e4a` |
| `arm-unknown-linux-gnueabihf` | `a0cbad4434df7bad3dd508a5cf4882804bb5f852a0cc80f9e49b44a81a0581d7` |
| `x86_64-apple-darwin` | `137785b8c20b3f7b06fa3037f985e5a07757770826ba9bd6fac223fdaa0bc64b` |
| `x86_64-pc-windows-msvc` | `ea868d563a39b57992262cd3b4dfc5fcb1ab5f919aa4f9a6d87fb8c10371994b` |
| `x86_64-unknown-linux-musl` | `fb79625deb47b4b5f1e5ee07dee019348acefde61cf823ddbbf8b8a30070048f` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.5
  with:
    binary-checksum: '0399587f276decc620daf7e1efa5b3ae520ba2d43d24a231cc72a1fd0ad64a70'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `a3f686ad94e75e416fb04297713a7f88599c78485ebbeef0e983af7295a94dcc` |
| `aarch64-pc-windows-msvc` | `8bfac19ca96e292e6c7e5b3255477879ba459e04e14d52d7e1e04a70c542ba07` |
| `aarch64-unknown-linux-musl` | `e3da0e2c25bb92375078691a0e272cb094f1be100295ffb8295200ccddef46cb` |
| `arm-unknown-linux-gnueabihf` | `9c81d395c38b5e2bd81fb4a4d3ca11ec2b81f115ce1b23f73d53da7b0fa4349e` |
| `x86_64-apple-darwin` | `6855561101233e5ca03430872af5afe47e95ccbbf8b95969fb8f0ba127e35512` |
| `x86_64-pc-windows-msvc` | `c10b52f5f19dfb64749c5e1a089b29ec22f8bfd1f746f6493cd61facc3bac8fb` |
| `x86_64-unknown-linux-musl` | `0399587f276decc620daf7e1efa5b3ae520ba2d43d24a231cc72a1fd0ad64a70` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.5
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.5
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
      - uses: tombi-toml/setup-tombi@v1.9.5
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
