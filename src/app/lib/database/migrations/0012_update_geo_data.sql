-- Add precision

ALTER TABLE pwz.merchants_geo_data
ADD COLUMN precision VARCHAR(15) DEFAULT NULL;
