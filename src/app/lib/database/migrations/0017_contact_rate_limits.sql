-- contact_rate_limits 

CREATE TABLE IF NOT EXISTS pwz.contact_rate_limits (
    ip_hash CHAR(64) PRIMARY KEY,

    window_start TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL DEFAULT 0,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_rate_limits_updated
    ON pwz.contact_rate_limits (updated_at);
