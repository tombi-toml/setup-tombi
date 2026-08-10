# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.2.10
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.2.10
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.2.10
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.2.10
  with:
    archive-checksum: 'abb3bc596699020506d7dccde7ea5f884970a2baabd4afab9cc513c1b75cb774'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `153adcddaa70c53358c08287ffa20697926c149f8413d700b9961793891561a7` |
| `aarch64-pc-windows-msvc` | `7691cc1a7aaae67ed23f885977a5bfb83d413790398d22790664ed337b0887ce` |
| `aarch64-unknown-linux-musl` | `8b4d25b27beac050000f1c36cca1b3bdafc1635efabb531ebf3777a8cea5bfc2` |
| `arm-unknown-linux-gnueabihf` | `6f43d7898cd9f12ac1a6d289b65c7729fcfd81599b6d47a368a49b15ae762aca` |
| `x86_64-apple-darwin` | `ef58f1ed7b6dc26cf6cb6dcaf82d79720d3527b082602d9e26605af1401642ff` |
| `x86_64-pc-windows-msvc` | `3ca0e9dcddc37714b3f72822fbc0f1bd8a3b66880ff8523194ecfd0e3b3e78b3` |
| `x86_64-unknown-linux-musl` | `abb3bc596699020506d7dccde7ea5f884970a2baabd4afab9cc513c1b75cb774` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.2.10
  with:
    binary-checksum: '11b0872bd06e501cfd218d28b538fd9ffc11a0480eedb4012a4d4a7df90cc972'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `8da2af0edf119edc0a3bad309d5edfa6a34600bba9021d30378465f3b5c53736` |
| `aarch64-pc-windows-msvc` | `8f58c34a62ab7770687a02d235da0ca9373a55b5b662d93cd3271e9ef5b00161` |
| `aarch64-unknown-linux-musl` | `ee7e9fd6c0126d2c456e4ad395519d827940ae8820e9658d6aabd5290eede8b0` |
| `arm-unknown-linux-gnueabihf` | `9cc483b3f20bde6f69e6468a2704f5b131345a5c8b67c6bcd8edc3cbcf2813f0` |
| `x86_64-apple-darwin` | `4c9c2d1485b0b2c909e841e59139330e20b06c0344ee10bb9ce4416508c6a15e` |
| `x86_64-pc-windows-msvc` | `94fb9f603d9beb3bdd52b5169bae8841432acd4028c478b769b932b826debf56` |
| `x86_64-unknown-linux-musl` | `11b0872bd06e501cfd218d28b538fd9ffc11a0480eedb4012a4d4a7df90cc972` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.2.10
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.2.10
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
      - uses: tombi-toml/setup-tombi@v1.2.10
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
