-- Table-level GRANTs for PostgREST's three roles. RLS policies alone are
-- not sufficient — Postgres checks object-level privileges *before* row
-- security, so without these GRANTs every request (even from service_role,
-- which bypasses RLS but not GRANTs) fails with "permission denied" no
-- matter how permissive the policies in 0002_rls.sql are.
--
-- anon / authenticated: broad GRANT + RLS is the standard Supabase
-- pattern — RLS is the actual restriction for these two roles.
-- service_role: has BYPASSRLS, used only server-side (admin CMS, seed
-- scripts, webhooks) — never shipped to a client.

grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on all tables in schema public to anon, authenticated, service_role;
grant usage, select on all sequences in schema public to anon, authenticated, service_role;

alter default privileges in schema public
  grant select, insert, update, delete on tables to anon, authenticated, service_role;
alter default privileges in schema public
  grant usage, select on sequences to anon, authenticated, service_role;
