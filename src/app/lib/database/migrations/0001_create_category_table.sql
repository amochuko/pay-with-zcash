CREATE TABLE IF NOT EXISTS pwz.categories(
    category_id uuid NOT NULL DEFAULT gen_random_uuid(),
    category_name varchar(120) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone,
    PRIMARY KEY(category_id)
);
