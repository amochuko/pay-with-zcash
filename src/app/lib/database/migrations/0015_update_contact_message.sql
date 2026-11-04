-- Update merchants table 

ALTER TABLE  pwz.contact_messages

ADD COLUMN email_notification_status VARCHAR(20) NOT NULL DEFAULT 'pending',

ADD COLUMN discord_notification_status VARCHAR(20) NOT NULL DEFAULT 'pending';
