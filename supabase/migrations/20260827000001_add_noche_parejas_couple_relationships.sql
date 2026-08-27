-- Noche de Parejas: keep every person in event_subscriptions (registrant and,
-- optionally, their spouse) and record the couple link + relationship type in a
-- dedicated noche_parejas_relationships table.

-- Drop the earlier couples-table experiment if it was applied.
DROP FUNCTION IF EXISTS check_noche_parejas_emails(TEXT[]);
DROP FUNCTION IF EXISTS create_noche_parejas_couple(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN
);
DROP TABLE IF EXISTS noche_parejas_couples;

CREATE TABLE noche_parejas_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES event_subscriptions(id) ON DELETE CASCADE,
  conyuge_subscription_id UUID NOT NULL REFERENCES event_subscriptions(id) ON DELETE CASCADE,
  conyuge_name TEXT NOT NULL,
  conyuge_lastname TEXT NOT NULL,
  relationship TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX noche_parejas_relationships_subscription_id_idx
  ON noche_parejas_relationships (subscription_id);

ALTER TABLE noche_parejas_relationships ENABLE ROW LEVEL SECURITY;

-- Registers the person who filled the form as an event_subscriptions row and,
-- when they add a spouse, either reuses the spouse's existing registration for
-- this event or creates a new one, then links the two with the relationship.
--
-- Returns TRUE when the spouse was already registered (so the client can warn
-- the user), FALSE otherwise. The registrant path preserves the existing
-- capacity check and unique-email-per-event behavior (23505 -> already
-- registered). The per-row current_count increment is handled by the existing
-- event_subscriptions trigger.
CREATE FUNCTION create_noche_parejas_registration(
  p_event_id UUID,
  p_name TEXT,
  p_lastname TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_accepts_data_policy BOOLEAN,
  p_with_conyuge BOOLEAN,
  p_conyuge_name TEXT DEFAULT NULL,
  p_conyuge_lastname TEXT DEFAULT NULL,
  p_conyuge_email TEXT DEFAULT NULL,
  p_conyuge_phone TEXT DEFAULT NULL,
  p_relationship TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_registrant_id UUID;
  v_conyuge_id UUID;
  v_conyuge_existed BOOLEAN := FALSE;
  v_conyuge_new BOOLEAN := FALSE;
  v_needed INT := 1;
  v_current INT;
  v_max INT;
BEGIN
  IF p_with_conyuge THEN
    IF lower(p_conyuge_email) = lower(p_email) THEN
      RAISE EXCEPTION 'conyuge_same_email';
    END IF;

    SELECT id INTO v_conyuge_id
    FROM event_subscriptions
    WHERE event_id = p_event_id AND lower(email) = lower(p_conyuge_email)
    LIMIT 1;

    IF v_conyuge_id IS NULL THEN
      v_conyuge_new := TRUE;
      v_needed := 2;
    ELSE
      v_conyuge_existed := TRUE;
    END IF;
  END IF;

  SELECT current_count, max_capacity INTO v_current, v_max
  FROM events WHERE id = p_event_id;

  IF v_current + v_needed > v_max THEN
    RAISE EXCEPTION 'Event has reached maximum capacity';
  END IF;

  INSERT INTO event_subscriptions (name, email, phone, event_id, accepts_data_policy)
  VALUES (
    p_name || ' ' || p_lastname, p_email, p_phone, p_event_id, p_accepts_data_policy
  )
  RETURNING id INTO v_registrant_id;

  IF p_with_conyuge THEN
    IF v_conyuge_new THEN
      INSERT INTO event_subscriptions (name, email, phone, event_id, accepts_data_policy)
      VALUES (
        p_conyuge_name || ' ' || p_conyuge_lastname,
        p_conyuge_email, p_conyuge_phone, p_event_id, p_accepts_data_policy
      )
      RETURNING id INTO v_conyuge_id;
    END IF;

    INSERT INTO noche_parejas_relationships (
      event_id, subscription_id, conyuge_subscription_id,
      conyuge_name, conyuge_lastname, relationship
    )
    VALUES (
      p_event_id, v_registrant_id, v_conyuge_id,
      p_conyuge_name, p_conyuge_lastname, p_relationship
    );
  END IF;

  RETURN v_conyuge_existed;
END;
$$;

-- Allow admins to read couple relationships from the dashboard. Mirrors the
-- event_subscriptions admin policy: app_metadata.is_admin, set by the auth
-- server and not user-editable.
CREATE POLICY "Admins can read noche parejas relationships"
  ON noche_parejas_relationships
  FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );
