# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.4.1
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.4.1
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.4.1
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.4.1
  with:
    archive-checksum: '9aa69eb3e75a4a22a961b8a1c8cc44e4f81328ce25ad5b10d151be1a09faa88d'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `0054ea75a98db2ccdef3b304bf97aeb2b1fed201df13b30b68a19672a275199c` |
| `aarch64-pc-windows-msvc` | `c27063949ce2f8330785a86c5115369ed643f821d007cfe19ed29735692e7c98` |
| `aarch64-unknown-linux-musl` | `21f51d092597053266e0ed051082743b5956b6de2f0db1cecce78e0eb29165e5` |
| `arm-unknown-linux-gnueabihf` | `f1f2af95173f1bf0ee7dec51e4c7d2bafd126a77f7bec53b79bd0e748362335d` |
| `x86_64-apple-darwin` | `4a14a0bf18ec0bbbeab3003f6c0dea3ffabb2cb38649ebfd6cafabc4d7eeffe0` |
| `x86_64-pc-windows-msvc` | `a0b324b673f469f82337df9561951b8dea2cb5fb491e98345929d3f5a55bfe84` |
| `x86_64-unknown-linux-musl` | `9aa69eb3e75a4a22a961b8a1c8cc44e4f81328ce25ad5b10d151be1a09faa88d` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.4.1
  with:
    binary-checksum: '3682c3ad66306d56ca1be6c0f13f04f6d4cce7e46be2f0ac247da620a7ae38d3'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `9a84a82ff9a95bebdf758c45053ead58aae5dad396e3326b4c3862a8358fcb9c` |
| `aarch64-pc-windows-msvc` | `2941eb89276b060df2f9414a3da56aa5f1263e39f7ef0055e6468aba94d8c836` |
| `aarch64-unknown-linux-musl` | `4538ecc2558a01d04b830220e3d7963a503469c74bfd12bbb18209eb24ed9b70` |
| `arm-unknown-linux-gnueabihf` | `6e0adf3810052136f7c404bbec500c477576fa6976046682b422395f94437c30` |
| `x86_64-apple-darwin` | `8a0444e943d9f9b68b375e48bdc2623d744de927e8f2956762ab8e05e51450d2` |
| `x86_64-pc-windows-msvc` | `4b747e1b4772a55d141fa2ada21e8cdf4d55497fd534a97f06bfdab3cfd612c2` |
| `x86_64-unknown-linux-musl` | `3682c3ad66306d56ca1be6c0f13f04f6d4cce7e46be2f0ac247da620a7ae38d3` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.4.1
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.4.1
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
      - uses: tombi-toml/setup-tombi@v1.4.1
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
