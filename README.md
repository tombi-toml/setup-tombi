# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.5
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.5
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.5
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.5
  with:
    archive-checksum: '05385bdf47d10828c1fc27190ee0ad44b777a57f56ea95c9ef568c845e3b7872'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `e4c3dd5346650b80afa516b851e0bffb4ea8a8b51ced974712fd0dd10cb893ee` |
| `aarch64-pc-windows-msvc` | `538a7a54ce02f877ff3d2f70056454ac5867f5473fce74c657c3d3a4818a2728` |
| `aarch64-unknown-linux-musl` | `0fa62b48aba40759e88a77e86ed20871819f0c15d9566cd56b17b71ece8b836b` |
| `arm-unknown-linux-gnueabihf` | `9b1736b52eefa5abba0e041d4d6718ca40572d129495fffb45d2de331f93d5dd` |
| `x86_64-apple-darwin` | `b020e2daba5c563842578d164b66340251d5c1fac67106f496af4a4d30625f1e` |
| `x86_64-pc-windows-msvc` | `c338abcf1b1d088ad9436d3cc0a37d5ce82cde414de56ef693ceec2ce8aa3ec7` |
| `x86_64-unknown-linux-musl` | `05385bdf47d10828c1fc27190ee0ad44b777a57f56ea95c9ef568c845e3b7872` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.5
  with:
    binary-checksum: 'bbcfeb65975d817f4c178eed872552e42154384e50cac1cb28863ea5f8fde331'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `6bc3373f40202dfa80c3e035916758c687c23f8c2eee0b3e1f54d019d337d6c8` |
| `aarch64-pc-windows-msvc` | `c60b038e298388f2e4ce24f94c4a07333bb7b6aa455426af68dbb06e48bd99b9` |
| `aarch64-unknown-linux-musl` | `3a1ba30eac7bd477a6570ebafa0611c5f1e3bec571ebd01c3964ab5df0ccf3db` |
| `arm-unknown-linux-gnueabihf` | `433da4aa53ff93ea20aa9193915fec81bc59416188826175a8765d99aab45db3` |
| `x86_64-apple-darwin` | `4437ac9d46f54696f92931ef016cba4697a6813d87599caf30f0bcd95c290850` |
| `x86_64-pc-windows-msvc` | `a60adf670570457e58b1e97cfc8ccf0bca8729da9c82edcfca76d005d8c997c1` |
| `x86_64-unknown-linux-musl` | `bbcfeb65975d817f4c178eed872552e42154384e50cac1cb28863ea5f8fde331` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.5
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.5
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
      - uses: tombi-toml/setup-tombi@v1.2.5
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
