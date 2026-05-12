# データベース設計

## ER図

```mermaid
erDiagram
  boards {
    int id PK
    string name
    datetime created_at
    datetime updated_at
  }

  lists {
    int id PK
    int board_id FK
    string name
    int position
    datetime created_at
    datetime updated_at
  }

  cards {
    int id PK
    int list_id FK
    string title
    text description
    date due_date
    string priority
    int position
    datetime created_at
    datetime updated_at
  }

  labels {
    int id PK
    string name
    string color
    datetime created_at
  }

  card_labels {
    int card_id FK
    int label_id FK
  }

  boards ||--o{ lists : "has"
  lists ||--o{ cards : "has"
  cards }o--o{ labels : "card_labels"
```

## エンティティ定義

| エンティティ | 説明 |
|---|---|
| boards | ボード。タスク管理の最上位単位 |
| lists | リスト。ボード内のカラム（例：To Do / 進行中 / 完了） |
| cards | カード。個々のタスク |
| labels | ラベル。カードに付与できるタグ |
| card_labels | カードとラベルの中間テーブル（多対多） |

## リレーション

| リレーション | 種別 | 説明 |
|---|---|---|
| boards → lists | 1対多 | 1つのボードは複数のリストを持つ |
| lists → cards | 1対多 | 1つのリストは複数のカードを持つ |
| cards ↔ labels | 多対多 | 1枚のカードに複数ラベルを付けられる |
