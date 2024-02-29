-- inserts a row into public."user" 
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$ 
begin
  insert into public."user" (
    id, 
    "name",
    "email",
    "user_id"
  ) 
  values (
    new.id,
    new.raw_user_meta_data->>'name', 
    new."email",
    new.id
  );
  return new;
end;
$$;

-- trigger the function every time a user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Security 
-- By default, supabase exposes the public schema but since we route through nextjs/trpc we don't need to do this
-- This also makes it so we don't need row-level security (RLS)
REVOKE USAGE ON SCHEMA public FROM anon, authenticated;

-- View for Prisma 
create or replace view auth_users as
select
  *
from
  auth.users
