/*
# Add foreign key from apartments.current_booking_id to bookings.id

1. Modified Tables
- `apartments`: Add FK constraint on `current_booking_id` referencing `bookings(id)` with ON DELETE SET NULL.

2. Security
- No policy changes. This is a structural integrity constraint only.

3. Notes
- Needed for the Supabase JS client to resolve the current_booking relation.
- Uses DROP IF EXISTS first for idempotency.
*/

ALTER TABLE apartments
  DROP CONSTRAINT IF EXISTS apartments_current_booking_id_fkey;

ALTER TABLE apartments
  ADD CONSTRAINT apartments_current_booking_id_fkey
  FOREIGN KEY (current_booking_id) REFERENCES bookings(id) ON DELETE SET NULL;