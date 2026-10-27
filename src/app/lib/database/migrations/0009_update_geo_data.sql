-- Add merchants_geo_data table with geo data to use for map features

ALTER TABLE pwz.merchants_geo_data
DROP COLUMN geo_status;

ALTER TABLE pwz.merchants_geo_data
ADD COLUMN geo_status VARCHAR(12) DEFAULT 'unknown';
