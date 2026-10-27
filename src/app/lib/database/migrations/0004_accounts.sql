-- Add accounts table

CREATE TABLE IF NOT EXISTS pwz.accounts(
     id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL DEFAULT gen_random_uuid(),
    username varchar(50) NOT NULL,
    password varchar(255) NOT NULL,
    email_address varchar(150) NOT NULL,
    role varchar(20) NOT NULL DEFAULT 'user'::character varying,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone,
    last_login timestamp with time zone ,
    PRIMARY KEY(user_id) 
); 
CREATE UNIQUE INDEX accounts_username_key ON pwz.accounts USING btree (username);
CREATE UNIQUE INDEX accounts_email_address_key ON pwz.accounts USING btree (email_address);
