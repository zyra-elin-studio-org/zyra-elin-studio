
-- App role enum + secure roles table
create type public.app_role as enum ('admin', 'viewer');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null default 'viewer',
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

alter table public.user_roles enable row level security;

-- security definer to avoid recursive RLS
create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "Admins manage roles" on public.user_roles
  for all using (public.has_role(auth.uid(), 'admin')) with check (public.has_role(auth.uid(), 'admin'));
create policy "Users read own roles" on public.user_roles
  for select using (auth.uid() = user_id);

-- Auto-promote the studio owner on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if new.email = 'palash.chowdury02@gmail.com' then
    insert into public.user_roles (user_id, role) values (new.id, 'admin')
    on conflict do nothing;
  else
    insert into public.user_roles (user_id, role) values (new.id, 'viewer')
    on conflict do nothing;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Videos
create table public.videos (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_bn text not null default '',
  description_en text default '',
  description_bn text default '',
  video_url text not null,
  thumbnail_url text default '',
  category text not null default 'general',
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.videos enable row level security;
create policy "Public reads videos" on public.videos for select using (true);
create policy "Admins write videos" on public.videos for all
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Images
create table public.images (
  id uuid primary key default gen_random_uuid(),
  title_en text not null,
  title_bn text default '',
  image_url text not null,
  category text not null default 'general',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.images enable row level security;
create policy "Public reads images" on public.images for select using (true);
create policy "Admins write images" on public.images for all
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- Inquiries
create table public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text default '',
  brand_name text default '',
  service_type text default '',
  budget_range text default '',
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.inquiries enable row level security;
create policy "Public submits inquiry" on public.inquiries for insert with check (true);
create policy "Admins read inquiries" on public.inquiries for select using (public.has_role(auth.uid(),'admin'));
create policy "Admins update inquiries" on public.inquiries for update using (public.has_role(auth.uid(),'admin'));
create policy "Admins delete inquiries" on public.inquiries for delete using (public.has_role(auth.uid(),'admin'));

-- Site settings
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  value text not null,
  updated_at timestamptz not null default now()
);
alter table public.site_settings enable row level security;
create policy "Public reads settings" on public.site_settings for select using (true);
create policy "Admins write settings" on public.site_settings for all
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

insert into public.site_settings (key, value) values
  ('whatsapp','+8801401459739'),
  ('facebook','https://www.facebook.com/ZyraElin'),
  ('email','contact@zyraelin.com'),
  ('facebook_page','Zyra Elin Studio');
