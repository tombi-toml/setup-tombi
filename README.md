# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.10
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.10
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.10
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.10
  with:
    archive-checksum: 'ba176a1ccc522200ab92c02073480f63bfdd83c480ff45fd7b49e273728f53d1'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `09b415661230d839e138429bb7563c8365e9c8fd136457d17441ecf0bc476af9` |
| `aarch64-pc-windows-msvc` | `60aedbf9b5ea2915aee7818700a6f34fbbde1da4661cae0c1b15027a0317ae3f` |
| `aarch64-unknown-linux-musl` | `1e18b9a23bab0dd0c35f6d175a89767d23708ac4b2716922db00bae230c018eb` |
| `arm-unknown-linux-gnueabihf` | `f58c3f8927915478d97e04c3e8f621723ce0eadc1d0deec2ec43f79cb66afd1a` |
| `x86_64-apple-darwin` | `9c91ca1a3fe77923a295ee818415e2a73e4fc776535a928cb87219e3961a66db` |
| `x86_64-pc-windows-msvc` | `39fa233b8133ba22c696eaa5bcbb89a071ea68dcec78f33da130f61f807e581b` |
| `x86_64-unknown-linux-musl` | `ba176a1ccc522200ab92c02073480f63bfdd83c480ff45fd7b49e273728f53d1` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.10
  with:
    binary-checksum: 'f2012ed70336192a5ff2b1c4b78af5ac15161287adeaf74af93d0ed7e41801fa'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `7e70afd09d032cd47314dd2081438d4b1a890a66ac7bf7df3f960568cbaf7f0f` |
| `aarch64-pc-windows-msvc` | `474f42341228f5f89c2fc8319d1d0ab9eaf0ade43b885dd5f3cc73b9b1847ffc` |
| `aarch64-unknown-linux-musl` | `3ab04f4104f46961149bc1220954ae1890ee35f46587b619eb1c740fd60e7857` |
| `arm-unknown-linux-gnueabihf` | `046381bb2ad9bc1566e9d661ce5ad56e0316d229891c65bba364c7f9b00abeed` |
| `x86_64-apple-darwin` | `9c546b614815eb41b49f574034fc12f5a09060d5132a0452f67cbcb41f5a9383` |
| `x86_64-pc-windows-msvc` | `da0f73f663f024a8a9d90806199db3efce4fb5fb73959c62c14300254d482f9a` |
| `x86_64-unknown-linux-musl` | `f2012ed70336192a5ff2b1c4b78af5ac15161287adeaf74af93d0ed7e41801fa` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.10
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.10
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
      - uses: tombi-toml/setup-tombi@v1.8.10
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
