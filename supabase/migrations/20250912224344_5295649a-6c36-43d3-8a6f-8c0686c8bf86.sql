-- Move extensions from public schema to extensions schema
DROP EXTENSION IF EXISTS pg_cron;
DROP EXTENSION IF EXISTS pg_net;

-- Create extensions in the proper schema
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Re-schedule the CRON job using the correct schema reference
SELECT extensions.cron.schedule(
  'fetch-news-every-15-minutes',
  '*/15 * * * *', -- every 15 minutes
  $$
  SELECT
    extensions.net.http_post(
        url:='https://cdosoffnbfjmjddzroab.supabase.co/functions/v1/fetch-news',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkb3NvZmZuYmZqbWpkZHpyb2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc2MTA1NDMsImV4cCI6MjA3MzE4NjU0M30.FzJijVkCib6qLvFpcP44afYxNrhUusaZwuJcBSaKsLU"}'::jsonb,
        body:='{"scheduled": true}'::jsonb
    ) as request_id;
  $$
);