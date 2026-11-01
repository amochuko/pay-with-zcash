-- Update merchants table 

CREATE TABLE IF NOT EXISTS pwz.contact_notification_jobs(
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    contact_message_id UUID NOT NULL
        REFERENCES pwz.contact_messages(id) ON DELETE CASCADE,

    channel VARCHAR(20) NOT NULL
        CHECK (channel IN ('email', 'discord')),
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending'
        CHECK (status IN ('pending' ,'processing', 'sent', 'failed')),

    attempts SMALLINT NOT NULL DEFAULT 0
        CHECK (attempts > 0),

    next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    locked_until TIMESTAMPTZ,

    last_error TEXT,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,

    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE (contact_message_id, channel)
);

CREATE INDEX IF NOT EXISTS idx_contact_notification_jobs_pending
    ON pwz.contact_notification_jobs (next_attempt_at)
    WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_contact_notification_jobs_processing
    ON pwz.contact_notification_jobs (locked_until)
    WHERE status = 'processing';
