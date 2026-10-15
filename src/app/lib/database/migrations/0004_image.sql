-- Add image table

CREATE TABLE IF NOT EXISTS pwz.images(
    img_id uuid NOT NULL DEFAULT gen_random_uuid(),
    img_name TEXT NOT NULL,
    img_bin_data BYTEA NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
