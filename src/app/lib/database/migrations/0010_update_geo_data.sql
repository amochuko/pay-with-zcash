-- Add merchants_geo_data table with geo data to use for map features

ALTER TABLE pwz.merchants_geo_data
DROP COLUMN geo_confidence,
DROP COLUMN coordinates_source,
DROP COLUMN notes,
DROP COLUMN verified;

ALTER TABLE pwz.merchants_geo_data
ADD COLUMN geo_confidence VARCHAR(12) DEFAULT 'LOW',
ADD COLUMN coordinates_source VARCHAR(25) DEFAULT 'NOMINATIM',
ADD COLUMN notes VARCHAR(255) DEFAULT 'NOMINATIM',
ADD COLUMN verified BOOLEAN DEFAULT FALSE;
