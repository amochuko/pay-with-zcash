-- Update merchants table 

CREATE TABLE IF NOT EXISTS pwz.contact_notification_outbox(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_message_id UUID NOT NULL
        REFERENCES pwz.contact_messages(id) ON DELETE CASCADE,

    channel VARCHAR(20) NOT NULL
        CHECK (channel IN ('email', 'discord')),
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending' ,'processing', 'sent', 'failed')),

    attempts INTEGER NOT NULL DEFAULT 0,

    available_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    locked_until TIMESTAMPTZ,

    last_error TEXT,
    sent_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (contact_message_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_contact_outbox_pending
    ON pwz.contact_notification_outbox (available_at)
    WHERE status IN ('pending', 'processing');
