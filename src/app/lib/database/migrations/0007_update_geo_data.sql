-- Add merchants_geo_data table with geo data to use for map features

ALTER TABLE pwz.merchants_geo_data
RENAME COLUMN latitude TO lat;

ALTER TABLE pwz.merchants_geo_data
RENAME COLUMN longitude TO lng;
