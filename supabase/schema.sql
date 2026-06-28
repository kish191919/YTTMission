-- YTTM 탁구선교회 Supabase 스키마

-- 게시글 테이블
create table if not exists public.posts (
  id          bigserial primary key,
  title       text        not null,
  content     text        not null default '',
  category    text        not null default '선교 소식',
  image_url   text,
  published   boolean     not null default false,
  created_at  timestamptz not null default now()
);

-- 갤러리 테이블
create table if not exists public.gallery (
  id          bigserial primary key,
  title       text        not null,
  description text,
  image_url   text        not null,
  album       text        not null default '2024',
  taken_at    date,
  created_at  timestamptz not null default now()
);

-- RLS 활성화
alter table public.posts  enable row level security;
alter table public.gallery enable row level security;

-- 공개 읽기 정책 (published=true인 게시글만)
create policy "공개 게시글 읽기"
  on public.posts for select
  using (published = true);

-- 갤러리 공개 읽기
create policy "갤러리 공개 읽기"
  on public.gallery for select
  using (true);

-- 관리자용 전체 접근 (service_role 키 사용)
-- 실제 관리자 auth를 연결할 때 아래 정책을 추가하세요:
-- create policy "관리자 전체 접근"
--   on public.posts for all
--   using (auth.role() = 'service_role');

-- Storage 버킷 생성 (Supabase 대시보드에서도 가능)
-- insert into storage.buckets (id, name, public)
--   values ('gallery', 'gallery', true);

-- ──────────────────────────────────────────────────
-- 히어로 미디어 테이블 (홈페이지 슬라이드쇼)
-- ──────────────────────────────────────────────────
create table if not exists public.hero_media (
  id            bigserial   primary key,
  title         text        not null default '',
  media_url     text        not null,
  media_type    text        not null default 'image'
                check (media_type in ('image', 'video')),
  storage_path  text        not null default '',
  display_order integer     not null default 0,
  active        boolean     not null default true,
  created_at    timestamptz not null default now()
);

alter table public.hero_media enable row level security;

create policy "hero_media 공개 읽기"
  on public.hero_media for select
  using (active = true);

create policy "hero_media 관리자 insert"
  on public.hero_media for insert
  to authenticated
  with check (true);

create policy "hero_media 관리자 update"
  on public.hero_media for update
  to authenticated
  using (true)
  with check (true);

create policy "hero_media 관리자 delete"
  on public.hero_media for delete
  to authenticated
  using (true);

-- ──────────────────────────────────────────────────
-- hero-media Storage 버킷 정책
-- (대시보드에서 버킷 'hero-media' 생성 후 실행)
-- ──────────────────────────────────────────────────

-- insert into storage.buckets (id, name, public)
--   values ('hero-media', 'hero-media', true);

create policy "hero-media 공개 읽기"
  on storage.objects for select
  using (bucket_id = 'hero-media');

create policy "hero-media 관리자 업로드"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'hero-media');

create policy "hero-media 관리자 삭제"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'hero-media');

-- ──────────────────────────────────────────────────
-- 회원 기능 마이그레이션
-- ──────────────────────────────────────────────────

-- A. user_profiles 테이블
create table if not exists public.user_profiles (
  id           uuid        primary key references auth.users(id) on delete cascade,
  display_name text        not null default '',
  created_at   timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create policy "프로필 공개 읽기"
  on public.user_profiles for select
  using (true);

create policy "본인 프로필 수정"
  on public.user_profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 회원가입 시 자동으로 프로필 행 생성 트리거
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.user_profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- B. posts / gallery 에 회원 연결 컬럼 추가
alter table public.posts
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists images text[] not null default '{}';

alter table public.gallery
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists media_type text not null default 'image'
    check (media_type in ('image', 'video'));

-- 회원 게시글 작성 (즉시 공개)
create policy "회원 게시글 작성"
  on public.posts for insert
  to authenticated
  with check (auth.uid() = user_id and published = true);

-- 회원 갤러리 업로드
create policy "회원 갤러리 업로드"
  on public.gallery for insert
  to authenticated
  with check (auth.uid() = user_id);

-- C. member-uploads Storage 버킷
-- (대시보드에서 버킷 'member-uploads' 생성 후 실행)
-- insert into storage.buckets (id, name, public)
--   values ('member-uploads', 'member-uploads', true) on conflict (id) do nothing;

create policy "member-uploads 공개 읽기"
  on storage.objects for select
  using (bucket_id = 'member-uploads');

create policy "member-uploads 회원 업로드"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'member-uploads');

create policy "member-uploads 본인 삭제"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'member-uploads' and (storage.foldername(name))[1] = auth.uid()::text);
