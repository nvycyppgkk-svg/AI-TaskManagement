# 技術選定

## 概要

| レイヤー | 技術 | バージョン |
|---|---|---|
| フロントエンド | React | 19.2.7 |
| バックエンド | Java / Spring Boot | 25 / 4.0.6 |
| データベース | PostgreSQL | 16 |

---

## フロントエンド

導入済みバージョンは [frontend/package.json](../frontend/package.json) を参照。

| 項目 | 技術・ツール | バージョン | 選定理由 |
|---|---|---|---|
| UIフレームワーク | React | 19.2.7 | 指定技術 |
| 言語 | TypeScript | 6.0.3 | 型安全性・補完によるDX向上 |
| ビルドツール | Vite | 8.0.16 | React + TS 構成で最も軽量・高速 |
| スタイリング | Tailwind CSS | 4.3.1 | ユーティリティクラスで素早くUI構築できる |
| 状態管理 | Zustand | 5.0.14 | Reactと相性がよく軽量・シンプル |
| HTTPクライアント | Axios | 1.18.0 | REST API通信の定番。エラーハンドリングが容易 |
| ルーティング | React Router | 7.18.0 | SPA内のページ遷移制御 |
| ドラッグ&ドロップ | dnd-kit | 6.3.1 | React向けに設計されており軽量・アクセシブル |
| フォームバリデーション | React Hook Form | 未導入（導入予定） | 軽量でバリデーション実装が簡潔 |

---

## バックエンド

導入済みバージョンは [backend/build.gradle](../backend/build.gradle) を参照。

| 項目 | 技術・ツール | バージョン | 選定理由 |
|---|---|---|---|
| 言語 | Java | 25 | 指定技術（当初想定はLTSの21だが、構築時点の最新版を採用） |
| フレームワーク | Spring Boot | 4.0.6 | 指定技術。REST API構築に最適 |
| ORM | Spring Data JPA / Hibernate | Spring Boot 4.0.6 同梱 | Spring Boot標準。SQLをオブジェクトで扱える |
| バリデーション | Spring Validation | Spring Boot 4.0.6 同梱 | Spring Boot標準。アノテーションで入力検証 |
| API仕様 | REST API（JSON） | - | フロントエンドとの通信仕様 |
| ビルドツール | Gradle | 9.5.1 | Spring Bootとの親和性が高く設定が簡潔 |
| マイグレーション | Flyway | flyway-core / flyway-database-postgresql | Spring Boot との統合が容易。DBバージョン管理 |

---

## データベース

| 項目 | 技術・ツール | バージョン | 選定理由 |
|---|---|---|---|
| RDBMS | PostgreSQL | 16 | 指定技術。信頼性・機能の豊富さ |
| マイグレーション | Flyway | バックエンドに同梱 | Spring Boot との統合が容易。DBバージョン管理 |

---

## 開発環境・インフラ

| 項目 | 技術・ツール | 選定理由 |
|---|---|---|
| コンテナ | Docker / Docker Compose | PostgreSQL・バックエンドをローカルで一括起動 |
| バージョン管理 | Git / GitHub | 指定済み |
| IDEフロントエンド | VS Code | React / TypeScript 開発に最適 |
| IDEバックエンド | IntelliJ IDEA | Java / Spring Boot 開発に最適 |
| APIテスト | Postman | REST APIの動作確認 |

---

## スコープ外

- Next.js（指定により対象外）
- 認証・ログイン機能
- クラウドデプロイ（将来対応予定）
