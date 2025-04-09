# DB設計書

## テーブル設計

### coaching_records テーブル
コーチングの記録を保存するメインテーブル

| カラム名 | データ型 | 説明 | 制約 |
|---------|---------|------|------|
| id | INTEGER | プライマリーキー | PRIMARY KEY AUTOINCREMENT |
| date | TEXT | 日付 | NOT NULL |
| type | TEXT | 記録タイプ（'goal' or 'reflection'） | NOT NULL |
| question | TEXT | 質問内容 | NOT NULL |
| answer | TEXT | 回答内容 | NOT NULL |
| created_at | TEXT | レコード作成日時 | NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TEXT | レコード更新日時 | NOT NULL DEFAULT CURRENT_TIMESTAMP |

## インデックス
- `date` カラムにインデックスを作成（日付での検索を高速化）

## トリガー
- `updated_at` カラムを自動更新するトリガーを作成

## サンプルSQL

### テーブル作成
```sql
CREATE TABLE coaching_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    type TEXT NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_coaching_records_date ON coaching_records(date);

CREATE TRIGGER update_coaching_records_timestamp 
AFTER UPDATE ON coaching_records
BEGIN
    UPDATE coaching_records SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
```

### データ挿入例
```sql
INSERT INTO coaching_records (date, type, question, answer)
VALUES ('2024-03-20', 'goal', '今週の目標は何ですか？', 'プロジェクトの進捗を50%まで進めることです。');
```

### データ取得例
```sql
-- 特定の日付の記録を取得
SELECT * FROM coaching_records WHERE date = '2024-03-20';

-- 目標設定のみを取得
SELECT * FROM coaching_records WHERE type = 'goal';

-- 日付範囲で取得
SELECT * FROM coaching_records 
WHERE date BETWEEN '2024-03-01' AND '2024-03-31';
``` 