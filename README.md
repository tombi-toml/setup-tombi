# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    archive-checksum: '65586fb53f36b989636d2e83e27316d788056835cc7f8e6e38ba445fb17d9b43'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `db11c9c7e0b3d628ce62040f2e4be3cdacb808193de30959dbc48ad7250c3926` |
| `aarch64-pc-windows-msvc` | `f3ccf5813776f2202d8ee5258298c604f700c588f3ef3a974b0b85b2c864db29` |
| `aarch64-unknown-linux-musl` | `2f0242007c7723706b2c62bb07fc1351ffd9604bf45bfedde68f8588c61d260f` |
| `arm-unknown-linux-gnueabihf` | `e512e2730ac2599ba3a7692575cc2748e714dfab6a315c4e6cbebbd0a314fd5e` |
| `x86_64-apple-darwin` | `6dbc29396ee4c85bb73dcc67dd398772964bf2fca4ba671bed31e80fefe8a93a` |
| `x86_64-pc-windows-msvc` | `6a62ddbfda2e32a59e05fdab6d93a9c33938e0f0ae05594cad8666a81d91eef7` |
| `x86_64-unknown-linux-musl` | `65586fb53f36b989636d2e83e27316d788056835cc7f8e6e38ba445fb17d9b43` |

</details>

For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    binary-checksum: '80f66f194d2950f791cfcc84707ac82c7aa623dab4cf836d69ac1982453e3d84'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `cf26e34d83c54a899329df045e7cb22b798106aa78793cd13985cf5657214769` |
| `aarch64-pc-windows-msvc` | `dd2233f1d9a94f7f14c7fe07def06b83e3b2c91e85c87dc0af80f6fe06e87841` |
| `aarch64-unknown-linux-musl` | `229ca39a1733b4eb475f35445e2f378431843d485e450e8584288db23aaec21b` |
| `arm-unknown-linux-gnueabihf` | `30a8bfe889be54accddd456240e58360d28e0739e08218ca811699523e11df91` |
| `x86_64-apple-darwin` | `c2b06ab294a3130f9b1b4466622261f24db1a0ae8a3769ccf9e3d38bbf8206a8` |
| `x86_64-pc-windows-msvc` | `725e022cc7d5053c448ec790f27d44b8327970b1a2d7cb3723dae4b81451cd5c` |
| `x86_64-unknown-linux-musl` | `80f66f194d2950f791cfcc84707ac82c7aa623dab4cf836d69ac1982453e3d84` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.1.5
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
      - uses: tombi-toml/setup-tombi@v1.1.5
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
