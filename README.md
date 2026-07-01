# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.1.7
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.1.7
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.1.7
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.1.7
  with:
    archive-checksum: '7315e375d3a0c6a8ab2d64e833a5a8aa4deb79fbbc6cd0aea8343c0eb7ed382f'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `f77522c5280ed267fe6b1c4fd5f2dd647579fc2accdb6cbcb2bf9c1de9fe23ad` |
| `aarch64-pc-windows-msvc` | `0fda4d1d12e394bc71cea06e704ae5496809e18c931b29552cd6dbe1e33d7489` |
| `aarch64-unknown-linux-musl` | `aefff2704d7315c0623c5351dcb8bc6ee50030d74cec70fd3d528cfbd5c8c700` |
| `arm-unknown-linux-gnueabihf` | `9c0b1093c17398c46b63025528dbc952dc4f7d04110b6c80890fe58cfd44f1a9` |
| `x86_64-apple-darwin` | `0d5a48ac39c531497d14e0e6067fcf180a49b1f9e3a76dddc18b7af797d15aa4` |
| `x86_64-pc-windows-msvc` | `9958ca0235ac2cfa273296c709dc48b0857391dd34d22bac5804f6365daca26a` |
| `x86_64-unknown-linux-musl` | `7315e375d3a0c6a8ab2d64e833a5a8aa4deb79fbbc6cd0aea8343c0eb7ed382f` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.1.7
  with:
    binary-checksum: 'ad4cfb8285e1eb169709843d11b02ad517d55bb6d3f1aac52a914c364201d63b'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `1c2d4c285181b635d802aea8be5d98d99c2da164b978049cb9ee388129242eac` |
| `aarch64-pc-windows-msvc` | `a60fa9ddd5c1cb697f1293bc4ef5a972cbc1e78b2f2483d9f47cc7b39c16ed62` |
| `aarch64-unknown-linux-musl` | `36da83fd03b7a6037df35366570bf0007aece568d6214825b08a1af3638664f8` |
| `arm-unknown-linux-gnueabihf` | `a57872787494186e5df33787aa74382b9e43a757245fce70c5c30229a7cdb230` |
| `x86_64-apple-darwin` | `5dc445d56fd57dca9b27112b83edec4cb2c509f4cbb51dfc644e9d555e1880eb` |
| `x86_64-pc-windows-msvc` | `81376f6a1b2436f5fba6cb863eedf563b49974b3a77ed55af6722b75976e39f1` |
| `x86_64-unknown-linux-musl` | `ad4cfb8285e1eb169709843d11b02ad517d55bb6d3f1aac52a914c364201d63b` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.1.7
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.1.7
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
      - uses: tombi-toml/setup-tombi@v1.1.7
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
