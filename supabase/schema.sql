-- Ponto da Costela — esquema Supabase
-- Execute no SQL Editor do projeto. Depois crie o usuário do proprietário em
-- Authentication > Users e copie o UUID dele para a tabela admins abaixo.

create table if not exists public.admins (user_id uuid primary key references auth.users on delete cascade);

create table if not exists public.categories (
  id text primary key, position int not null default 0, data jsonb not null, updated_at timestamptz default now()
);
create table if not exists public.products (
  id text primary key, position int not null default 0, data jsonb not null, updated_at timestamptz default now()
);
create table if not exists public.settings (
  id text primary key, data jsonb not null, updated_at timestamptz default now()
);
create table if not exists public.orders (
  id uuid primary key, code text not null, status text not null default 'novo',
  data jsonb not null, created_at timestamptz not null default now()
);

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;

alter table public.admins enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.settings enable row level security;
alter table public.orders enable row level security;

-- Cardápio: leitura pública, escrita só do proprietário
create policy "menu leitura" on public.categories for select using (true);
create policy "menu leitura p" on public.products for select using (true);
create policy "menu leitura s" on public.settings for select using (true);
create policy "menu escrita" on public.categories for all using (public.is_admin()) with check (public.is_admin());
create policy "menu escrita p" on public.products for all using (public.is_admin()) with check (public.is_admin());
create policy "menu escrita s" on public.settings for all using (public.is_admin()) with check (public.is_admin());

-- Pedidos: qualquer cliente cria (status inicial 'novo'); só o proprietário lê e altera
create policy "pedido novo" on public.orders for insert with check (status = 'novo');
create policy "pedido leitura" on public.orders for select using (public.is_admin());
create policy "pedido status" on public.orders for update using (public.is_admin()) with check (public.is_admin());

create policy "admins leitura" on public.admins for select using (user_id = auth.uid());

-- Realtime (o cardápio público atualiza sozinho quando o dono edita)
alter publication supabase_realtime add table public.categories, public.products, public.settings, public.orders;

-- insert into public.admins (user_id) values ('UUID-DO-PROPRIETARIO');
