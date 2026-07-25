-- Allow admins to read consolidation registrations from the dashboard.
--
-- The table has RLS enabled since its creation migration but carries no
-- policies, so it is currently write-only through the
-- create_consolidation_registration SECURITY DEFINER function. This policy
-- opens SELECT to authenticated admins only.
--
-- Admin status comes from app_metadata.is_admin, which is the same claim the
-- web app checks in the /dashboard route guard. app_metadata is set by the
-- auth server and is not editable by the user, unlike user_metadata.

CREATE POLICY "Admins can read consolidation registrations"
  ON consolidation_registrations
  FOR SELECT
  TO authenticated
  USING (
    COALESCE((auth.jwt() -> 'app_metadata' ->> 'is_admin')::boolean, false)
  );
