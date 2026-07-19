# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.4
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.4
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.4
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.4
  with:
    archive-checksum: 'a74364d9c27835cefd9d7d9e4fee0487a7f68bc5289650e61050d6b0c395dc4d'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `f05da8a5e619e156057e2e13c452437ac45b0865d73cf371b99763b1b539612b` |
| `aarch64-pc-windows-msvc` | `a3501d0f52a3ae53e30fc5f28dba924a702360ebc0f351b8bdf828b6489df3f8` |
| `aarch64-unknown-linux-musl` | `91504ef7e605fca89ef55aea0a428ee58cf3e435f2650a8a9ce8886dd286b874` |
| `arm-unknown-linux-gnueabihf` | `a0f3f904ae489eb28d948cbfa81039ad718f56de2cc249d1ceec55c16e237424` |
| `x86_64-apple-darwin` | `54c94860225d348d3531a1c1ac81d86b6de315edc2640e143cfe18f2dcb0ca4d` |
| `x86_64-pc-windows-msvc` | `868d5b9c41503b910fcbdb00e636a5a67c00af168444bffee7297aac3fff00ba` |
| `x86_64-unknown-linux-musl` | `a74364d9c27835cefd9d7d9e4fee0487a7f68bc5289650e61050d6b0c395dc4d` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.4
  with:
    binary-checksum: '43d8a96965a36d80acd3a7196778c877b74e78047207c78bd189348c4fe38d77'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `747b217a834e1a618bf4acd61d2ead24d96d378b4fea67a6cdff639d08635290` |
| `aarch64-pc-windows-msvc` | `59d6497d1bff3681da334e649c1573c4ba64d12da17734df5f4c4918018fe80f` |
| `aarch64-unknown-linux-musl` | `e4be8020352c9fb5d99c8f35745a45dd4c1634c152ce9efc59f31edfcdcc0389` |
| `arm-unknown-linux-gnueabihf` | `88e2886fce51015ee26df675155fb31b004da6619a3771891f5cfc47b657fa05` |
| `x86_64-apple-darwin` | `7f899047802a5f69db9b21e27ac5a1012554f526e4cfe31f12d5f2388550375c` |
| `x86_64-pc-windows-msvc` | `4336b84f05af9d6190e76d5512cbd5d3ac657b4396af94ba181e75172eed6c9e` |
| `x86_64-unknown-linux-musl` | `43d8a96965a36d80acd3a7196778c877b74e78047207c78bd189348c4fe38d77` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.4
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.4
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
      - uses: tombi-toml/setup-tombi@v1.2.4
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
