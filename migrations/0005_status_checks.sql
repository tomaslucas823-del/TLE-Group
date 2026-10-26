-- Hardening: constrain status / method values at the database level.
-- Application already validates; these CHECKs are defence in depth.

alter table leads drop constraint if exists leads_status_check;
alter table leads add constraint leads_status_check
  check (status in ('novo', 'conversa', 'proposta', 'fechado'));

alter table installments drop constraint if exists installments_status_check;
alter table installments add constraint installments_status_check
  check (status in ('aberto', 'aguardando', 'recebido'));

alter table installments drop constraint if exists installments_method_check;
alter table installments add constraint installments_method_check
  check (method in ('', 'mpesa', 'emola', 'cartao', 'transferencia'));

-- Profiles already has a check; keep it explicit and consistent
alter table profiles drop constraint if exists profiles_role_check;
alter table profiles add constraint profiles_role_check
  check (role in ('studio', 'client'));
