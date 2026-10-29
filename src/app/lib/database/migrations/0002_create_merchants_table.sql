CREATE TABLE IF NOT EXISTS pwz.merchants(
    merchant_id uuid NOT NULL DEFAULT gen_random_uuid(),
    merchant_name varchar(50) NOT NULL,
    category_id uuid NOT NULL,
    website_url varchar NOT NULL,
    email_address varchar(100),
    subtitle varchar(255),
    description varchar,
    logo_url varchar(255) NOT NULL,
    upvote_count integer DEFAULT 0,
    tags text[],
    post_status post_status_enum,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone,
    PRIMARY KEY(merchant_id),
    CONSTRAINT fkey_category FOREIGN key(category_id) REFERENCES pwz.categories(category_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS merchants_merchant_name_key ON pwz.merchants USING btree (merchant_name);
