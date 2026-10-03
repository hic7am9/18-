/*
# Add display_order to apartments for manual reordering

1. Modified Tables
- `apartments`: Add `display_order` (integer, default 0) — manual sort order.

2. Security
- No policy changes. Existing RLS covers the new column.

3. Notes
- Initializes display_order based on creation order for existing rows.
*/

ALTER TABLE apartments ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

UPDATE apartments SET display_order = EXTRACT(EPOCH FROM created_at)::integer WHERE display_order = 0;