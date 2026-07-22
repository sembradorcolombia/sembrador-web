CREATE TABLE consolidation_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  mobile TEXT NOT NULL,
  email TEXT NOT NULL,
  next_step TEXT NOT NULL,
  comment TEXT,
  accepts_data_policy BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE consolidation_registrations ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION create_consolidation_registration(
  p_name TEXT,
  p_lastname TEXT,
  p_mobile TEXT,
  p_email TEXT,
  p_next_step TEXT,
  p_accepts_data_policy BOOLEAN,
  p_comment TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO consolidation_registrations
    (name, lastname, mobile, email, next_step, comment, accepts_data_policy)
  VALUES
    (p_name, p_lastname, p_mobile, p_email, p_next_step, p_comment, p_accepts_data_policy);
END;
$$;
