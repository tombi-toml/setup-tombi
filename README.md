# setup-tombi

This action sets up [Tombi](https://github.com/tombi-toml/tombi) in your GitHub Actions workflow.

## Usage

### Basic usage

```yaml
- uses: tombi-toml/setup-tombi@v1
```

### Install a specific version

```yaml
- uses: tombi-toml/setup-tombi@v1
  with:
    version: '0.4.10'
```

### Install with checksum verification

```yaml
- uses: tombi-toml/setup-tombi@v1
  with:
    version: '0.4.10'
    checksum: 'sha256-checksum-here'
```

## Inputs

| Name | Description | Required | Default |
|------|-------------|----------|---------|
| `version` | Version of Tombi to install (e.g., "0.3.31", "latest") | No | - |
| `checksum` | SHA256 checksum to validate the downloaded executable | No | - |

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
      - uses: tombi-toml/setup-tombi@v1
        with:
          version: '0.4.10'
      - name: Validate TOML files
        run: tombi lint
```

## License

MIT
