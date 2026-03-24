-- RPC function to save connection response (want_to_connect and prayer_request)
-- Marked as SECURITY DEFINER to allow anonymous users to call it (bypasses RLS)
CREATE OR REPLACE FUNCTION save_connection_response(
  p_subscription_id uuid,
  p_want_to_connect boolean,
  p_prayer_request text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE event_subscriptions
  SET
    want_to_connect = p_want_to_connect,
    prayer_request = p_prayer_request
  WHERE id = p_subscription_id;
END;
$$;

-- Grant EXECUTE permission to anonymous users
GRANT EXECUTE ON FUNCTION save_connection_response(uuid, boolean, text) TO anon;
