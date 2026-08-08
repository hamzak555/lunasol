-- Add booking_link column to events table
ALTER TABLE events ADD COLUMN IF NOT EXISTS booking_link TEXT;

-- Add comment to column
COMMENT ON COLUMN events.booking_link IS 'Optional URL for booking/purchasing tickets for the event';
