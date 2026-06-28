# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.1.6
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.1.6
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.1.6
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.1.6
  with:
    archive-checksum: '774491f7cc990b86ee2e14d41d08743f7bd953ba2269a46ca5096e75de83e18a'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `85775462cd3dc5e6f184a2633df7c114a84184d4b04c5f8e512760bf9e09fc97` |
| `aarch64-pc-windows-msvc` | `d2b6251ef7eabc4cfe1ba6f668be4c9133775aa88fa17f29d616adc7b1099bae` |
| `aarch64-unknown-linux-musl` | `cb3026435a3795a933b7df7d129025108d6d94675ec46b66539f2fad1a6fbd49` |
| `arm-unknown-linux-gnueabihf` | `f798f7d1c94c744c1cb8d0d64a5a98fea0b2cb434181eea5c369eb95fb8399c7` |
| `x86_64-apple-darwin` | `e0e81fbbd629d207a739e13b849246dba9ae43f744d2cdd3c8cd00939a8ffe2a` |
| `x86_64-pc-windows-msvc` | `44938ccdae426a576e63f95c2ff8a762f40d995540db6771665cc2990cfccc8a` |
| `x86_64-unknown-linux-musl` | `774491f7cc990b86ee2e14d41d08743f7bd953ba2269a46ca5096e75de83e18a` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.1.6
  with:
    binary-checksum: '387960edf55c5337e09b78a18bc4b55093bd73d9dbf951940f22a892b31b8ebb'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `5537b8e00beb4eccb97dc7443c30f20b0e6f7f05b023a0556157039f9a6931a9` |
| `aarch64-pc-windows-msvc` | `a8816dfb57693a0db27f4d8e5957b7e7c1b667bf45b4eca7ccd1919ded1fc6e8` |
| `aarch64-unknown-linux-musl` | `748ce8c601f55c1ef9c74ebb6468897211de7e69f27ec82185ff4e1732b70aab` |
| `arm-unknown-linux-gnueabihf` | `2c6915f7c0c6e8fd279b8ef497c311db052d883fd00720df62d124d312d8aa50` |
| `x86_64-apple-darwin` | `e18bc3e2de1383737a561662879be76fb3dabc7388bde94170adf8dba242afd8` |
| `x86_64-pc-windows-msvc` | `944d3dca1a89d8a673e79ebd8915662801b1d478f24794c2bb4b72850bd2b9ec` |
| `x86_64-unknown-linux-musl` | `387960edf55c5337e09b78a18bc4b55093bd73d9dbf951940f22a892b31b8ebb` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.1.6
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.1.6
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
      - uses: tombi-toml/setup-tombi@v1.1.6
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
