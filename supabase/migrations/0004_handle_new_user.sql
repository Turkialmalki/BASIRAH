-- Auto-creates a `profiles` row for every new auth.users row — guest
-- (anonymous sign-in, spec §27) or real signup alike. Without this, every
-- write to a user-owned table (user_scene_progress, streaks, ...) 404s on
-- its `references profiles (id)` foreign key the moment a brand-new user
-- tries to do anything, since Supabase Auth only creates the auth.users
-- row, never the app-level profiles row.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, is_guest)
  values (new.id, new.email, new.email is null)
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
