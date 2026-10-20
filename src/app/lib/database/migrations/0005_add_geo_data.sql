-- Add merchants_geo_data table with geo data to use for map features

CREATE TABLE IF NOT EXISTS pwz.merchants_geo_data(
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    merchant_id uuid NOT NULL,
    latitude FLOAT8 NOT NULL DEFAULT 0.0,
    longitude FLOAT8 NOT NULL DEFAULT 0.0,
    country_code VARCHAR(10) DEFAULT NULL,
    country_name VARCHAR(30) DEFAULT NULL,
    city VARCHAR(30) DEFAULT NULL,
    region VARCHAR(20) DEFAULT NULL,
    geo_status VARCHAR(12) NOT NULL DEFAULT 'unknown',
    geo_confidence VARCHAR(12) NOT NULL DEFAULT 'LOW',
    coordinates_source VARCHAR(25) NOT NULL DEFAULT 'NOMINATIM',
    notes VARCHAR(255) NOT NULL DEFAULT 'NOMINATIM',
    verified BOOLEAN NOT NULL DEFAULT FALSE, 
    created_at timestamp without time zone DEFAULT now(),
    last_verified timestamp without time zone,
    updated_at timestamp without time zone,
    PRIMARY KEY(id),
    CONSTRAINT fkey_merchant FOREIGN key(merchant_id) REFERENCES pwz.merchants(merchant_id)
);


ALTER TABLE pwz.merchants_geo_data
ADD CONSTRAINT merchants_status_check
    CHECK (geo_status IN ('resolved', 'partial', 'unknown'));
