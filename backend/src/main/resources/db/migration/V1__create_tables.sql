CREATE TABLE boards (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE lists (
    id         SERIAL PRIMARY KEY,
    board_id   INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name       VARCHAR(255) NOT NULL,
    position   INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE cards (
    id          SERIAL PRIMARY KEY,
    list_id     INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    due_date    DATE,
    priority    VARCHAR(50),
    position    INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE labels (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    color      VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE card_labels (
    card_id  INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    label_id INTEGER NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (card_id, label_id)
);
