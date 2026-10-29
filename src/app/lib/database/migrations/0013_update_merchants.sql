-- Update merchants table 

ALTER TABLE pwz.merchants
ADD COLUMN logo_content_type TEXT;

ALTER TABLE pwz.merchants
ADD CONSTRAINT merchants_logo_content_type_check
CHECK (logo_content_type IS NULL OR logo_content_type LIKE 'image/%');
