-- Update CONSTRAINT

-- Drop existing foreign key
ALTER TABLE pwz.merchants_geo_data
    DROP CONSTRAINT fkey_merchant;


-- Recreate it with ON DELETE CASCADE
ALTER TABLE pwz.merchants_geo_data
    ADD CONSTRAINT fkey_merchant_id
    FOREIGN KEY (merchant_id)
    REFERENCES pwz.merchants(merchant_id)
    ON DELETE CASCADE;
