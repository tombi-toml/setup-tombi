# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.5.7
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.5.7
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.5.7
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.5.7
  with:
    archive-checksum: '9695859dd6aca07c11dcf1b8a8dab70c23427d420fc231aac49371f9d3ec0754'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `a962426f2af7f3ef23108291432ca7ff57d24637941ba09e9ebb05528c2e9c8d` |
| `aarch64-pc-windows-msvc` | `6c986d549c125310198508bbb539235e47843edca7b6c26c255fc7822023d927` |
| `aarch64-unknown-linux-musl` | `9d4bbb33689a441599ac8b3c827e44ecee638e1624e4e146f3517019ff396bd4` |
| `arm-unknown-linux-gnueabihf` | `003319a267d2f06bbd3783ced661d31d52502ef4ba2de08b21cb97291739a2c4` |
| `x86_64-apple-darwin` | `cc320e1cee926ac256021f3727b241438eeeda601672ab6220604445fd077b8c` |
| `x86_64-pc-windows-msvc` | `938b012abf29a30c5856cffd2eedbd03728c9b62450dd93388241ed840fd9daf` |
| `x86_64-unknown-linux-musl` | `9695859dd6aca07c11dcf1b8a8dab70c23427d420fc231aac49371f9d3ec0754` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.5.7
  with:
    binary-checksum: 'ccb452e70e05eab7cf6d0d62c306e848e0e9799b121871c2afcdf2fc7430bc70'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `bf3b6fd24b9c77e65445f3816df0c0f7ba3d9db5bfdfdbab69408a2f1522c4d6` |
| `aarch64-pc-windows-msvc` | `7e18587e65f0109354c35fd4f940b9621d8199564fbbeabe820fdf02e8503f08` |
| `aarch64-unknown-linux-musl` | `837aed65edf7473358c90d4b8dbc86ca6039a7c3dfd5a2e67c0654689c79f46f` |
| `arm-unknown-linux-gnueabihf` | `254997f4f7251752a2e16d4308248ca6a0ce73cca5dd4a7a807f948e3f69091e` |
| `x86_64-apple-darwin` | `5aec2ec58ebaa96b783183f867a303a6f0d94b23bbaf01a01c90e26cb40202a7` |
| `x86_64-pc-windows-msvc` | `6436c74dc3f6d4e7985ddfade5c60e2196e62f8af6a365bad4b07c4e9dee05c5` |
| `x86_64-unknown-linux-musl` | `ccb452e70e05eab7cf6d0d62c306e848e0e9799b121871c2afcdf2fc7430bc70` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.5.7
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.5.7
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
      - uses: tombi-toml/setup-tombi@v1.5.7
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
