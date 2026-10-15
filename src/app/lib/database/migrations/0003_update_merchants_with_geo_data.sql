-- Update merchants table with geo data to use for map features

ALTER TABLE pwz.merchants
ADD COLUMN country VARCHAR(30) NOT NULL,
ADD COLUMN state VARCHAR(30) NOT NULL DEFAULT 'NA',
ADD COLUMN city VARCHAR(30) NOT NULL DEFAULT 'NA',
ADD COLUMN geo_status VARCHAR(12) NOT NULL DEFAULT 'unknown';


ALTER TABLE pwz.merchants
ADD CONSTRAINT merchants_status_check
    CHECK (geo_status IN ('resolved', 'partial', 'unknown'));
