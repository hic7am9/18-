/*
# Add guest email and Airbnb account linking

1. Modified Tables
- `bookings`: Add `guest_email` (text, nullable).
- `guests_archive`: Add `guest_email` (text, nullable).
- `apartments`: Add `airbnb_account` (text, nullable).

2. Security
- No new tables. Existing RLS policies cover the new columns automatically.

3. Notes
- All new columns are nullable so existing rows are unaffected.
*/

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS guest_email text;
ALTER TABLE guests_archive ADD COLUMN IF NOT EXISTS guest_email text;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS airbnb_account text;