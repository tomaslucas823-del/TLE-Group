-- Profiles: role per auth user (studio = CRM, client = portal filtrado)
create table if not exists profiles (
  user_id text primary key,
  role text not null check (role in ('studio', 'client')),
  client_id integer,
  created_at timestamptz not null default now()
);

create index if not exists profiles_role_idx on profiles (role);
create index if not exists profiles_client_idx on profiles (client_id);
