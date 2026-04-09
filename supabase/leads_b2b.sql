create table if not exists public.leads_b2b (
  id uuid primary key default gen_random_uuid(),
  nome_empresa text not null,
  contato_nome text not null default '',
  contato_telefone text not null,
  qtd_pcs text not null default '',
  status text not null default 'novo'
    check (status in ('novo', 'contatado', 'visita_agendada', 'proposta_enviada', 'fechado', 'perdido')),
  observacao text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.leads_b2b enable row level security;
-- O servidor usa service role key e bypassa o RLS automaticamente.
-- Nao ha acesso publico direto a essa tabela.
