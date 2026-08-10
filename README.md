# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.9
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.9
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.9
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.9
  with:
    archive-checksum: '406084aa965a196d16b127e5a5d9379b9b0cebcfea0ef73f63fc309044488a6c'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `4db87b103cc5319189b402ac10888818a8a6d6b3142f60a9fed0dd60189044c0` |
| `aarch64-pc-windows-msvc` | `e67f042e6b3a24713ffc3beaf88b38f76786eb21f3e51d6105232eb5ab97ff46` |
| `aarch64-unknown-linux-musl` | `7938a6efaf17fcf1be052ae91bfcdda9f6615f2e25fd3151f943021d3bfdb742` |
| `arm-unknown-linux-gnueabihf` | `81bc56f41ecaad3fcabd7b0e2f09238da22b63e9b035a6e31c81f666a2247edc` |
| `x86_64-apple-darwin` | `1b0dfadb9ae2a15bd9e21de98594fd94d36b005737f6adb0dafca8b3e33a443d` |
| `x86_64-pc-windows-msvc` | `2f265d58b74d7008af84cd8ba484be38943f236b68482ea9644caf8279b3c9d4` |
| `x86_64-unknown-linux-musl` | `406084aa965a196d16b127e5a5d9379b9b0cebcfea0ef73f63fc309044488a6c` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.9
  with:
    binary-checksum: 'b544a52d67e96078cd5b25b464bedf24321eb3ada6ecbb2ddd363c941aab9ee2'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `ab0b12a436e347ff20b25f9db3ca869ef3cc1632d1bd12e657108f4b28e2568f` |
| `aarch64-pc-windows-msvc` | `9cde2780b84cbc1e89b5cec9adc25958e618e87f4fa0a2d937ac98226aeb49f8` |
| `aarch64-unknown-linux-musl` | `5aec0058725a8f58a2d0c030cacbb434276b5bdf06aa686eca10710f06b31249` |
| `arm-unknown-linux-gnueabihf` | `5501c11626eefd40efe17d6a1e7a5dfe0e7ca7b5f627e65c34b983df947cfc80` |
| `x86_64-apple-darwin` | `1c75e41f0896f6186aa94de04a55ec8bbc569d5a69ddbc0f196dfe8eb2d04ae9` |
| `x86_64-pc-windows-msvc` | `014cf65f61832ad8a8562a3edc6f21cc007e6dddfd5bf339268cc0397ee23ff6` |
| `x86_64-unknown-linux-musl` | `b544a52d67e96078cd5b25b464bedf24321eb3ada6ecbb2ddd363c941aab9ee2` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.9
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.9
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
      - uses: tombi-toml/setup-tombi@v1.2.9
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
