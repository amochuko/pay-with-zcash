-- Update merchants table with geo data to use for map features

ALTER TABLE pwz.merchants
ADD COLUMN accepts_shielded BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN payment_direct VARCHAR(10) NOT NULL DEFAULT 'direct';
