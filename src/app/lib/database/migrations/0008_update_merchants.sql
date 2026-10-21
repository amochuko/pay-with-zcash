-- Update merchants table with geo data to use for map features

ALTER TABLE pwz.merchants
DROP COLUMN geo_status;

ALTER TABLE pwz.merchants
ADD COLUMN geo_status VARCHAR(12) DEFAULT 'unknown';


 