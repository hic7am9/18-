/*
# Add iCal URL and Airbnb Listing ID to apartments

1. Modified Tables
- `apartments`: Add `ical_url` (text, nullable) — iCal sync URL for automated booking import.
- `apartments`: Add `airbnb_listing_id` (text, nullable) — Airbnb listing ID for API integration.

2. Security
- No new tables. Existing RLS policies cover the new columns automatically.
*/

ALTER TABLE apartments ADD COLUMN IF NOT EXISTS ical_url text;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS airbnb_listing_id text;