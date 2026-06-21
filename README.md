# AI-TaskManagement

Trelloライクな個人向けKanbanタスク管理ボード。ITスクールのカリキュラム課題として、要件定義→設計→実装→テストの一連の開発工程を体験するために開発している。

## 概要

- ボードを作成し、ボード内のリスト（To Do / 進行中 / 完了など）にカードを追加してタスクを管理する
- カードはドラッグ&ドロップでリスト間・リスト内を移動できる（優先度順・期限順への並び替えにも対応）
- カードにはタイトル・説明・期限・優先度・ラベルを設定できる
- ログイン不要の個人利用を想定（認証機能なし）

詳細な要件は [docs/requirements.md](docs/requirements.md) を参照。

## 技術スタック

| 層 | 技術 | バージョン |
|---|---|---|
| フロントエンド | React + TypeScript + Vite + Tailwind CSS + Zustand | 19.2.7 / 6.0.3 / 8.0.16 / 4.3.1 / 5.0.14 |
| バックエンド | Java + Spring Boot + Gradle | 26 / 4.0.6 / 9.5.1 |
| DB | PostgreSQL + Flyway | 16 |
| インフラ | Docker / Docker Compose | - |

バージョン選定の詳細・理由は [docs/tech-stack.md](docs/tech-stack.md) を参照。

## ディレクトリ構成

```
TaskManagement/
├── backend/                 # Spring Boot アプリケーション
│   └── src/main/java/com/example/taskmanagement/
│       ├── controller/      # REST APIエンドポイント
│       ├── service/         # ビジネスロジック
│       ├── repository/      # データアクセス（Spring Data JPA）
│       ├── entity/          # JPAエンティティ（Board / BoardList / Card / Label）
│       ├── dto/response/    # レスポンスDTO
│       ├── exception/       # 例外・ハンドリング
│       └── config/          # CORS等の設定
├── frontend/                # React アプリケーション
│   └── src/
│       ├── api/             # APIクライアント
│       ├── components/      # UIコンポーネント（boards / kanban / modals / layout / ui）
│       ├── hooks/           # カスタムフック
│       ├── pages/           # 画面単位のコンポーネント
│       ├── store/           # Zustandストア
│       └── types/           # 型定義
├── docs/                    # 要件定義・設計ドキュメント
├── prototype/                # UIプロトタイプ（静的HTML）
├── docker-compose.yml
└── CLAUDE.md                 # 開発ルール
```

## ドキュメント

| ドキュメント | 内容 |
|---|---|
| [要件定義書](docs/requirements.md) | プロジェクト概要、ユースケース、操作フロー |
| [機能要件](docs/functional-requirements.md) | ボード・リスト・カード・ラベルの機能一覧、エラー時の挙動 |
| [画面設計](docs/screen-design.md) | 画面一覧、画面遷移図、各画面のUI仕様 |
| [データベース設計](docs/database.md) | ER図、エンティティ定義、リレーション |
| [非機能要件](docs/non-functional.md) | レスポンシブ・パフォーマンス・ブラウザ対応など |
| [技術選定](docs/tech-stack.md) | 技術スタックとバージョン、選定理由 |

## セットアップ・起動方法

このプロジェクトは固定ポートで動作する。**別ポートでの起動は禁止**（[CLAUDE.md](CLAUDE.md) 参照）。

| サービス | ポート |
|---|---|
| フロントエンド（Vite） | 5173 |
| バックエンド（Spring Boot） | 8080 |
| DB（PostgreSQL） | 5432 |

### Docker Composeで一括起動

```bash
docker compose up -d
```

### 個別に起動する場合

```bash
# DB（PostgreSQL）
docker compose up -d db

# バックエンド
cd backend && ./gradlew bootRun

# フロントエンド
cd frontend && npm install && npm run dev
```

ポート競合時の対処は [CLAUDE.md](CLAUDE.md#サーバー起動ルールmust) を参照。

## 開発ワークフロー

Issue起票 → ブランチ作成 → コミット（Conventional Commits） → Pull Request の順で進める。ブランチ命名規則・コミットルール・禁止事項などの詳細は [CLAUDE.md](CLAUDE.md) を参照。

## リポジトリ

[nvycyppgkk-svg/AI-TaskManagement](https://github.com/nvycyppgkk-svg/AI-TaskManagement)
