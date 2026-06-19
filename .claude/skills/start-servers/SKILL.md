---
name: start-servers
description: TaskManagementプロジェクトのバックエンド(Spring Boot)/フロントエンド(Vite)/DB(PostgreSQL)を固定ポートで起動する。サーバー起動・再起動・「ポートが使われている」等のポート競合対応が必要なときに使う。
---

# サーバー起動スキル

このプロジェクトは固定ポートを使用する。**別ポートでの一時起動は禁止**（CLAUDE.md準拠）。

| サービス | ポート | 起動コマンド |
|---|---|---|
| バックエンド（Spring Boot） | 8080 | `cd backend && ./gradlew bootRun` |
| フロントエンド（Vite） | 5173 | `cd frontend && npm run dev` |
| DB（PostgreSQL） | 5432 | `docker compose up -d` |

## 手順（MUST）

1. 起動前に対象ポートの競合を確認する。

   ```bash
   lsof -i :8080
   lsof -i :5173
   lsof -i :5432
   ```

2. 競合プロセスが見つかった場合は、**そのプロセスを停止してから**指定ポートで起動する。別ポートへの変更は禁止。

   ```bash
   # PIDを指定して停止
   kill <PID>

   # またはプロセス名で停止
   pkill -f "gradlew|bootRun"   # バックエンド
   pkill -f "vite"              # フロントエンド
   ```

3. 競合がなければ、指定ポートでそのまま起動する。

   ```bash
   cd backend && ./gradlew bootRun     # 8080
   cd frontend && npm run dev          # 5173
   docker compose up -d                # DB 5432
   ```

## 注意

- ポート変更で回避するのではなく、必ず競合プロセスを停止すること。
- DBはDocker Composeで管理するため、ローカルにPostgreSQLが別途起動していないか確認すること。
