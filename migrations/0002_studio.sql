create table if not exists workspace_seed (
  user_id text primary key
);

create table if not exists clients (
  id serial primary key,
  user_id text not null,
  name text not null,
  email text not null,
  phone text not null,
  city text not null,
  notes text not null default ''
);
create index if not exists clients_user_idx on clients (user_id);

create table if not exists leads (
  id serial primary key,
  user_id text not null,
  name text not null,
  email text not null,
  phone text not null,
  area_m2 integer not null,
  style text not null,
  complexity text not null,
  estimate_cents integer not null,
  message text not null default '',
  status text not null default 'novo'
);
create index if not exists leads_user_idx on leads (user_id);

create table if not exists projects (
  id serial primary key,
  user_id text not null,
  client_id integer not null,
  title text not null,
  place text not null,
  stage text not null,
  cover text not null,
  summary text not null
);
create index if not exists projects_user_idx on projects (user_id);

create table if not exists milestones (
  id serial primary key,
  user_id text not null,
  project_id integer not null,
  label text not null,
  status text not null,
  position integer not null
);
create index if not exists milestones_project_idx on milestones (user_id, project_id);

create table if not exists approvals (
  id serial primary key,
  user_id text not null,
  project_id integer not null,
  label text not null,
  image text not null,
  approved boolean not null default false
);
create index if not exists approvals_project_idx on approvals (user_id, project_id);

create table if not exists meetings (
  id serial primary key,
  user_id text not null,
  client_name text not null,
  title text not null,
  starts_at text not null,
  place text not null,
  notes text not null default ''
);
create index if not exists meetings_user_idx on meetings (user_id);

create table if not exists proposals (
  id serial primary key,
  user_id text not null,
  lead_id integer,
  client_name text not null,
  project_title text not null,
  total_cents integer not null,
  scope text not null
);
create index if not exists proposals_user_idx on proposals (user_id);

create table if not exists installments (
  id serial primary key,
  user_id text not null,
  proposal_id integer not null,
  label text not null,
  percent integer not null,
  amount_cents integer not null,
  due_label text not null,
  status text not null default 'aberto',
  method text not null default ''
);
create index if not exists installments_proposal_idx on installments (user_id, proposal_id);
