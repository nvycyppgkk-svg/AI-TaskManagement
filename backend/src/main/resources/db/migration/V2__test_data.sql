INSERT INTO boards (name) VALUES ('プロジェクトA');

INSERT INTO lists (board_id, name, position) VALUES (1, 'Todo',   0);
INSERT INTO lists (board_id, name, position) VALUES (1, '進行中', 1);
INSERT INTO lists (board_id, name, position) VALUES (1, '完了',   2);

INSERT INTO labels (name, color) VALUES ('バグ', '#e74c3c');
INSERT INTO labels (name, color) VALUES ('機能', '#2ecc71');
INSERT INTO labels (name, color) VALUES ('急ぎ', '#e67e22');

INSERT INTO cards (list_id, title, description, due_date, priority, position)
VALUES (1, 'ログイン画面を作る', 'メールとパスワードの入力フォームを実装', '2026-06-20', 'HIGH', 0);

INSERT INTO cards (list_id, title, description, due_date, priority, position)
VALUES (1, 'DB設計を見直す', 'cardsテーブルのインデックスを検討', '2026-06-15', 'MEDIUM', 1);

INSERT INTO cards (list_id, title, description, due_date, priority, position)
VALUES (2, 'APIを実装する', 'Spring BootでCRUD APIを実装する', '2026-06-18', 'HIGH', 0);

INSERT INTO cards (list_id, title, description, due_date, priority, position)
VALUES (2, 'Docker環境を整える', 'docker-compose.ymlを調整', NULL, 'LOW', 1);

INSERT INTO cards (list_id, title, description, due_date, priority, position)
VALUES (3, 'README作成', 'セットアップ手順をREADMEに記載した', '2026-06-01', 'LOW', 0);

INSERT INTO card_labels (card_id, label_id) VALUES (1, 2);
INSERT INTO card_labels (card_id, label_id) VALUES (3, 2);
INSERT INTO card_labels (card_id, label_id) VALUES (3, 3);
INSERT INTO card_labels (card_id, label_id) VALUES (5, 1);
