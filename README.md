# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1.8.2
```

This is the recommended form from `setup-tombi@v1.1.0` onward. When `with.version` is omitted, the action installs the `tombi` CLI version that matches the `setup-tombi` release version.

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1.8.2
  with:
    version: '1.0.0'
```

### Install a version from a lock file

```yaml
- uses: tombi-toml/setup-tombi@v1.8.2
  with:
    lockfile: 'uv.lock'
```

### Install with checksum verification

The checksum examples below are for GitHub-hosted Linux x64 runners (`x86_64-unknown-linux-musl`).

#### For the archive

```yaml
- uses: tombi-toml/setup-tombi@v1.8.2
  with:
    archive-checksum: '7c9f3a481a93960507c42ce6679442292cfffc19cbcae12ecd6f2890f3f3508f'
```

<details>
<summary>🔐 Archive checksums for all supported targets</summary>

| Target | Archive checksum |
|--------|----------|
| `aarch64-apple-darwin` | `934a47edfb999fe9edbedb5ecfe0414cea22bcfb556389235faa5669abacd29d` |
| `aarch64-pc-windows-msvc` | `a1a03d75a96f9d1030a2b0a61192ce05c463b7c2fd170560f502d648dd6df1af` |
| `aarch64-unknown-linux-musl` | `899b72f8d20dd0e9c0c47273be3c8539231216e4838cb1a83491e78fd1510faf` |
| `arm-unknown-linux-gnueabihf` | `65e68aadf36409e41b8205635313b46f78b18d40a04f030c9a562f9e6ac06df9` |
| `x86_64-apple-darwin` | `d00dbd567a4b5f17b18c02f67c3ed75e32980e8207735df52fa18ef207172e75` |
| `x86_64-pc-windows-msvc` | `20f72343cdc910becd6df3c7b22bcf2295d1896a42a1d723519eaaf8ebe930d2` |
| `x86_64-unknown-linux-musl` | `7c9f3a481a93960507c42ce6679442292cfffc19cbcae12ecd6f2890f3f3508f` |

</details>

#### For the executable binary

```yaml
- uses: tombi-toml/setup-tombi@v1.8.2
  with:
    binary-checksum: '4cae95d427fe8d308f635fdaa1eee5a1eee121c9e6fabf2f48f09efcb8142f01'
```

<details>
<summary>🔐 Executable binary checksums for all supported targets</summary>

| Target | Binary checksum |
|--------|----------|
| `aarch64-apple-darwin` | `6af1a31ff6b7500741a17bd9b0aa7dc083c386763153a15ac5e04c3f424d2f53` |
| `aarch64-pc-windows-msvc` | `c63639a547f219655b16226eec229a81fe03b70186500519a546268e8c052962` |
| `aarch64-unknown-linux-musl` | `1dd42758a34c3ef0e366857cd557dfcc92f67f941c7dc126b95b9179c8597829` |
| `arm-unknown-linux-gnueabihf` | `b2b948b0e107c6e9a86f28fb6b28202a2a3eeae2f3860241d7331fd7dcf06e51` |
| `x86_64-apple-darwin` | `30a9519bd0b79ebf2721f07e437d2898b8bd0f6c0282f622f5524dbaee83a1b2` |
| `x86_64-pc-windows-msvc` | `226b069b4196bdb81b0d36197133ec2299265468b309c11405037fe09232021b` |
| `x86_64-unknown-linux-musl` | `4cae95d427fe8d308f635fdaa1eee5a1eee121c9e6fabf2f48f09efcb8142f01` |

</details>

### Cache behavior
- `true`: always enables cache.
- `false`: always disables cache.
- `auto` (default): enables cache unless the runner environment is `self-hosted` runner.

Use `enable-cache: true` only when you want to force cache on, for example on self-hosted runners.

```yaml
- uses: tombi-toml/setup-tombi@v1.8.2
  with:
    enable-cache: true
```

### Use a custom cache directory

```yaml
- uses: tombi-toml/setup-tombi@v1.8.2
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
      - uses: tombi-toml/setup-tombi@v1.8.2
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
