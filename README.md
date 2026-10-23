# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.9.1
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.9.1
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.9.1
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.9.1
  with:
    archive-checksum: '09194b4f38e414e534c19f382822b3f7aa4f06405d3679126dd2c2a88b926355'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `986131f459c9d953bdd3a4bd025e162cf2296aa3ac8804b1bea6ad5508543d58` |
| `aarch64-pc-windows-msvc` | `1c6e22ce768eec1c81f4da8adaa965534f07584bfee53698838bf96d68c3cdec` |
| `aarch64-unknown-linux-musl` | `9c30d1d0c540fdb537c71f056dc610eb40983971ec4c9de813aa1b29934288a2` |
| `arm-unknown-linux-gnueabihf` | `f0a2eb9ef9bb73a45ef3171705e4342542cef64f5c978c5efbe234bf6f623604` |
| `x86_64-apple-darwin` | `b827e6eda2cfbdaebd356923db02679fae05b7e95d209326f00a2c1c9615b23b` |
| `x86_64-pc-windows-msvc` | `48ecf4c52113c1a7d6ad17f4bbd002d02b596831bc265a9c71504feb130da7c3` |
| `x86_64-unknown-linux-musl` | `09194b4f38e414e534c19f382822b3f7aa4f06405d3679126dd2c2a88b926355` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.9.1
  with:
    binary-checksum: 'f75f7760081b47cf0ee0f1a93e061aa751db0a06081bffc0122ea85eb04c9821'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `d4802830c0fa211f6338ded35a63d4657aaab6f357c2ec7e42703874d59361ee` |
| `aarch64-pc-windows-msvc` | `1d28134fdd5ba399cb9719af32732cb6949ac2eeadd8352652c398cccdb94f0a` |
| `aarch64-unknown-linux-musl` | `3771a3f7622e3e3a57219caf7e2a19c70d218305600dda6efd628f75bae1abb0` |
| `arm-unknown-linux-gnueabihf` | `c7b39ffe4878838794d23f7244e62a3c331cfca4716461ce1866983aad392210` |
| `x86_64-apple-darwin` | `ddac9571a46857efc8710bd26e8d8db12b5697e3c62f38b62355a2d15b4efe9d` |
| `x86_64-pc-windows-msvc` | `e6a42d2c2d29c4fa3c8e42f37f188a8bcd73864a7ca30693769958c7d635cd81` |
| `x86_64-unknown-linux-musl` | `f75f7760081b47cf0ee0f1a93e061aa751db0a06081bffc0122ea85eb04c9821` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.9.1
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.9.1
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
      - uses: tombi-toml/setup-tombi@v1.9.1
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
