-- Seed the couples dinner event used by the /noche-parejas landing.
-- Re-running this migration is idempotent: it only inserts if the event name does not exist.
INSERT INTO events (name, max_capacity, current_count)
SELECT 'Noche de Parejas', 100, 0
WHERE NOT EXISTS (
  SELECT 1 FROM events WHERE name = 'Noche de Parejas'
);
