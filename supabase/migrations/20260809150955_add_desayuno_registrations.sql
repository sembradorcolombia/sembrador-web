CREATE TABLE desayuno_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  lastname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  accepts_data_policy BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE desayuno_registrations ENABLE ROW LEVEL SECURITY;

CREATE FUNCTION create_desayuno_registration(
  p_name TEXT,
  p_lastname TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_accepts_data_policy BOOLEAN
) RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO desayuno_registrations
    (name, lastname, email, phone, accepts_data_policy)
  VALUES
    (p_name, p_lastname, p_email, p_phone, p_accepts_data_policy);
END;
$$;
