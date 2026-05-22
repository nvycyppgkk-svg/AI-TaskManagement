# 技術選定

## 概要

| レイヤー | 技術 |
|---|---|
| フロントエンド | React |
| バックエンド | Java / Spring Boot |
| データベース | PostgreSQL |

---

## フロントエンド

| 項目 | 技術・ツール | 選定理由 |
|---|---|---|
| UIフレームワーク | React 18 | 指定技術 |
| 言語 | TypeScript | 型安全性・補完によるDX向上 |
| ビルドツール | Vite | React + TS 構成で最も軽量・高速 |
| スタイリング | Tailwind CSS | ユーティリティクラスで素早くUI構築できる |
| 状態管理 | Zustand | Reactと相性がよく軽量・シンプル |
| HTTPクライアント | Axios | REST API通信の定番。エラーハンドリングが容易 |
| ドラッグ&ドロップ | dnd-kit | React向けに設計されており軽量・アクセシブル |
| フォームバリデーション | React Hook Form | 軽量でバリデーション実装が簡潔 |

---

## バックエンド

| 項目 | 技術・ツール | 選定理由 |
|---|---|---|
| 言語 | Java 21 | 指定技術。LTSバージョン |
| フレームワーク | Spring Boot 3.x | 指定技術。REST API構築に最適 |
| ORM | Spring Data JPA / Hibernate | Spring Boot標準。SQLをオブジェクトで扱える |
| バリデーション | Spring Validation | Spring Boot標準。アノテーションで入力検証 |
| API仕様 | REST API（JSON） | フロントエンドとの通信仕様 |
| ビルドツール | Gradle | Spring Boot 3.x との親和性が高く設定が簡潔 |

---

## データベース

| 項目 | 技術・ツール | 選定理由 |
|---|---|---|
| RDBMS | PostgreSQL 16 | 指定技術。信頼性・機能の豊富さ |
| マイグレーション | Flyway | Spring Boot との統合が容易。DBバージョン管理 |

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
