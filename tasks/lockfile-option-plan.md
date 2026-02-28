# lockfile オプション対応案

## 背景と目的
- 現状 `setup-tombi` は `version` 入力でのみインストール対象バージョンを指定できる。
- ユーザー要望は、`version` を直接書かず、既存の lock ファイルに含まれる `tombi` のバージョンを参照したい、というもの。
- そのため `version` の代替として `lockfile` 入力を追加し、`version` と同時指定は禁止する。

## 入力仕様（確定）
- 新規 input: `lockfile`（必須: `false`）
- 排他制約:
  - `version` と `lockfile` が同時指定された場合は `core.setFailed(...)` でエラー終了。
- 優先順位:
  - `version` が指定されていればそれを使う（`lockfile` 未指定前提）。
  - `lockfile` が指定されていれば lock ファイルから解決したバージョンを使う。
  - どちらも未指定なら現行同様 `--version` を付けずにインストーラスクリプトへ委譲（= latest 相当）。

## 対応ロックファイル一覧（確定）

### Phase 1（今回対応）
| Ecosystem | Lock file | 形式 | `tombi` バージョン抽出方針 |
|---|---|---|---|
| Python | `uv.lock` | TOML | `[[package]]` の `name == "tombi"` を探し `version` を取得 |
| Python | `poetry.lock` | TOML | `[[package]]` の `name == "tombi"` を探し `version` を取得 |
| TypeScript | `pnpm-lock.yaml` | YAML | `importers` / `packages` から `tombi` / `@tombi-toml/tombi` を解決して version を取得 |
| TypeScript | `package-lock.json` | JSON | `packages`（lockfileVersion 2/3）または `dependencies`（lockfileVersion 1）から `tombi` を解決して version を取得 |
| TypeScript | `yarn.lock` | lock text | `tombi@...` の stanza を探索して version を抽出（Yarn v1/v2 の差分を parser 側で吸収） |
| TypeScript | `bun.lock` | text lock | `tombi` エントリを探索し version を抽出（フォーマット差分は parser 側で吸収） |

## 実装方針

### 1. `action.yml` 入力拡張
- `inputs.lockfile` を追加（説明: lock ファイルから `tombi` バージョンを解決する）。
- `version` 説明にも「`lockfile` と同時指定不可」を追記。

### 2. `src/index.ts` の責務分離
- 追加する関数案:
  - `resolveRequestedVersion(versionInput, lockfileInput): Promise<string | undefined>`
  - `resolveVersionFromLockfile(lockFilePath): Promise<string>`
  - `detectLockfileKind(lockFilePath): LockFileKind`
  - `extractVersionByKind(kind, content): string | undefined`
- `run()` では最初に排他チェックとバージョン解決だけ行い、既存のインストール処理は極力変更しない。

### 3. パーサー戦略
- TOML/YAML/JSON/text を lock file 種別ごとに明示的に分岐。
- まずは「想定フォーマットに対して堅牢」な最小実装を採用し、必要なら専用 parser 依存を追加。
- `tombi` のパッケージ名はエイリアス配列で管理し、`tombi` と `@tombi-toml/tombi` を許容する。

### 4. エラー設計
- 同時指定:  
  - 例: ``Inputs `version` and `lockfile` are mutually exclusive.``
- 未対応ファイル:  
  - 例: ``Unsupported lock file: <path>. Supported: uv.lock, poetry.lock, pnpm-lock.yaml, package-lock.json, yarn.lock, bun.lock``
- `tombi` 未検出:  
  - 例: ``Package `tombi` was not found in lock file: <path>``
- 取得失敗時は install を実行せず終了。

### 5. テスト方針（`src/index.test.ts`）
- 正常系:
  - `lockfile`（各対応フォーマット）から version を抽出し、`--version <resolved>` が install コマンドに反映される。
- 異常系:
  - `version` と `lockfile` の同時指定で失敗。
  - lock ファイルが存在しない／未対応拡張子／`tombi` 未検出で失敗。
- 後方互換:
  - `version` のみ、未指定（latest 相当）の既存ケースが壊れないことを維持。

## 実装ステップ
1. `action.yml` と `README.md` に `lockfile` の仕様を追加。
2. `src/index.ts` に排他チェック + lock file 解析ロジックを実装。
3. `src/index.test.ts` に lock file fixture ベースのテストを追加。
4. `pnpm test` で回帰確認。
5. 必要なら `dist/index.js` を再生成。

## 確定事項
1. 対応範囲は 6 ファイル（`uv.lock`, `poetry.lock`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `bun.lock`）。
2. パッケージ名は alias を許容し、`tombi` と `@tombi-toml/tombi` を対象にする。
