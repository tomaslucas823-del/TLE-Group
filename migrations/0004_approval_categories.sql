-- Peças do projecto no portal: categoria + tipo de ficheiro
alter table approvals
  add column if not exists category text not null default 'aparencia';

alter table approvals
  add column if not exists kind text not null default 'image';

-- Valores esperados:
-- category: aparencia | plantas | estrutura | documentos
-- kind: image | pdf
