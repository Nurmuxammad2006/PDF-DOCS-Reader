CREATE TABLE IF NOT EXISTS telegram_user_preferences (
    telegram_user_id BIGINT PRIMARY KEY,
    document_notifications_enabled BOOLEAN NOT NULL DEFAULT TRUE
);
