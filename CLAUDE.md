# CLAUDE.md — TaskManagement プロジェクト開発ルール

このファイルはClaudeCodeが必ず参照し、厳守すべき開発ルールを定義する。

---

## プロジェクト概要

TrelloライクなKanbanタスク管理ボード。

| 層 | 技術 |
|---|---|
| フロントエンド | React 18 + TypeScript + Vite + Tailwind CSS + Zustand |
| バックエンド | Java 21 + Spring Boot 3.x + Gradle |
| DB | PostgreSQL 16 + Flyway |
| インフラ | Docker / Docker Compose |
| バージョン管理 | Git / GitHub (`nvycyppgkk-svg/AI-TaskManagement`) |

---

## 開発ワークフロー（必須手順）

**作業開始前に必ず以下の順番で実施すること。**

### 1. Issueを起票する

```bash
gh issue create --title "feat: 〇〇の実装" --body "..."
# または
gh issue create --title "fix: 〇〇のバグを修正" --body "..."
```

- すべての作業はIssueから始める。Issueなしでブランチを切ることは禁止。
- タイトルプレフィックス: 機能追加=`feat:` / バグ修正=`fix:` / ドキュメント=`docs:` / 環境整備=`chore:`

### 2. ブランチを作成する

Issue番号が確定してから切ること。

```bash
git switch -c feature/#{番号}-{kebab-case説明}
```

**命名規則:**

| 種別 | パターン | 例 |
|---|---|---|
| 機能追加 | `feature/#{N}-{説明}` | `feature/#12-add-card-modal` |
| バグ修正 | `fix/#{N}-{説明}` | `fix/#15-drag-drop` |
| ドキュメント | `docs/#{N}-{説明}` | `docs/#8-update-readme` |
| 環境・設定 | `chore/#{N}-{説明}` | `chore/#3-setup-docker` |

### 3. コミットする（Conventional Commits）

```
{type}({scope}): {説明（日本語可）}
```

**type一覧:**

| type | 用途 |
|---|---|
| `feat` | 新機能 |
| `fix` | バグ修正 |
| `docs` | ドキュメントのみの変更 |
| `style` | フォーマット・セミコロン等（ロジック変更なし） |
| `refactor` | リファクタリング |
| `test` | テストの追加・修正 |
| `chore` | ビルド・設定・依存関係の変更 |

**scope一覧（このプロジェクト固有）:**

| scope | 対象 |
|---|---|
| `board` | ボード関連 |
| `list` | リスト関連 |
| `card` | カード関連 |
| `label` | ラベル関連 |
| `api` | バックエンドAPIエンドポイント |
| `db` | Flywayマイグレーション・スキーマ |
| `ui` | UIコンポーネント全般 |
| `infra` | Docker・docker-compose |
| `deps` | 依存関係の更新 |

**例:**
```
feat(card): カード詳細モーダルの実装
fix(api): カード取得APIのNullPointerExceptionを修正
docs(db): ER図をdatabase.mdに追記
chore(infra): docker-compose.ymlにRedisを追加
```

1コミット1論理変更。WIPコミットは禁止。

### 4. Pull Requestを作成する

```bash
gh pr create --base main --title "feat(card): カード詳細モーダルの実装 #12"
```

- `gh pr create` を使い、PRテンプレート（`.github/PULL_REQUEST_TEMPLATE.md`）に従う
- タイトル形式: `{type}({scope}): {説明} #{Issue番号}`
- base branchは必ず `main`

---

## 禁止事項（MUST NOT）

- **`git push origin main` による直接pushは絶対禁止**（GitHub側でもブロックされる）
- **`--force` / `-f` を使ったpushは絶対禁止**
- **Issue番号なしでブランチを切ることは禁止**
- **mainブランチ上で直接コミットすることは禁止**

---

## ディレクトリ構成

```
TaskManagement/
├── backend/          # Spring Boot アプリケーション
│   ├── src/
│   └── build.gradle
├── docs/             # 要件定義・設計ドキュメント
├── prototype/        # UIプロトタイプ（静的HTML）
├── docker-compose.yml
└── CLAUDE.md         # このファイル
```

---

## よく使うコマンド

```bash
# バックエンド起動
cd backend && ./gradlew bootRun

# Docker環境起動
docker compose up -d

# gh CLI — Issue/PR操作
gh issue list
gh issue create --title "..." --body "..."
gh pr list
gh pr create --base main
gh pr merge --squash
```
