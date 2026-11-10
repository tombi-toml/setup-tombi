# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.11.2
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.11.2
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.11.2
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.11.2
  with:
    archive-checksum: '8bb862497e99b415310ede463ee6cf997845368d3e6d4edac4dd33b07084beb3'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `035be0afc61549adbe9ce6b6ab582cfff99bcd6b86f38f847149c3819dc89d33` |
| `aarch64-pc-windows-msvc` | `c6da0c40b5f969acb6a1063874f31b6b3a2f24505a88c169a4d04834cd55af35` |
| `aarch64-unknown-linux-musl` | `14122e634113d2d9b1210b3f01d5139289575494a2d585824e1e51e116a58d96` |
| `arm-unknown-linux-gnueabihf` | `51ce60d4570ad0429b1be09240dba1288d69df5a341c204ec672899a7406f3e2` |
| `x86_64-apple-darwin` | `09ed72a2e8a5a57fa325f95942833692bdc838b4ca4c0964dfbad20da44553c3` |
| `x86_64-pc-windows-msvc` | `fc059da801b0f6f6dd816eb4ede2a532d1562bc16c56cfe6557a9ecfa81a235a` |
| `x86_64-unknown-linux-musl` | `8bb862497e99b415310ede463ee6cf997845368d3e6d4edac4dd33b07084beb3` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.11.2
  with:
    binary-checksum: '687de7d3ae7d4ea07ac7adc7755c4773118d16cbf99dd599181c6ecc3ef93f97'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `cca71bf4a4e84740024735b5c3f66b38591733d4175fb0d541464c6e2d92e2f0` |
| `aarch64-pc-windows-msvc` | `aaa120ddb95bc4f9f8cf6a68b5058addab56cdbf11300ed52a8edf1dcc56f96b` |
| `aarch64-unknown-linux-musl` | `cd329c2b0730fc3852b1b1812f2aebeaafe1fff0175ffd3f34375e8455eeb3fe` |
| `arm-unknown-linux-gnueabihf` | `0f448c99b2c08da5321a0e00e3f1ed107d5ed2adc1339fe9b2072d81d12f975f` |
| `x86_64-apple-darwin` | `5ff7473ad9097ad1b3507a52364629c79bff04b3ef29ad08e43e404c531109f3` |
| `x86_64-pc-windows-msvc` | `962fba8ebfde54a1c2fe8e04f434b049106a1e5061289559966e24800ba219d9` |
| `x86_64-unknown-linux-musl` | `687de7d3ae7d4ea07ac7adc7755c4773118d16cbf99dd599181c6ecc3ef93f97` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.11.2
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.11.2
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
      - uses: tombi-toml/setup-tombi@v1.11.2
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
