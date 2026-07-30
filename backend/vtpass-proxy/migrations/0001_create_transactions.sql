CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  uid TEXT NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  amount REAL NOT NULL,
  direction TEXT NOT NULL,
  status TEXT NOT NULL,
  request_id TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_transactions_uid_created_at ON transactions (uid, created_at DESC);
