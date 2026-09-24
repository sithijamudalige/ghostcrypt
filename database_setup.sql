-- 1. Create Profiles Table (for Users and Admins)
create table public.profiles (
  id uuid references auth.users not null primary key,
  email text not null,
  full_name text,
  role text default 'publisher' check (role in ('admin', 'publisher')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create Articles Table
create table public.articles (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  content text not null,
  youtube_id text, -- To embed YouTube videos
  author_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create Quizzes Table
create table public.quizzes (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create Questions Table
create table public.questions (
  id uuid default uuid_generate_v4() primary key,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  question_text text not null,
  options jsonb not null, -- Array of strings e.g. ["A", "B", "C", "D"]
  correct_answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create Quiz Results Table
create table public.quiz_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  quiz_id uuid references public.quizzes(id) on delete cascade not null,
  score integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Trigger to create a profile automatically when a user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'publisher' -- Default role
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Enable RLS (Row Level Security) and Policies
alter table public.profiles enable row level security;
alter table public.articles enable row level security;
alter table public.quizzes enable row level security;
alter table public.questions enable row level security;
alter table public.quiz_results enable row level security;

-- Simple Policies (Allow read access to everyone, write access to logged in users)
create policy "Public can view articles" on public.articles for select using (true);
create policy "Users can insert their own articles" on public.articles for insert with check (auth.uid() = author_id);
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Public can view quizzes" on public.quizzes for select using (true);
create policy "Public can view questions" on public.questions for select using (true);
create policy "Users can view their own results" on public.quiz_results for select using (auth.uid() = user_id);
create policy "Users can insert their own results" on public.quiz_results for insert with check (auth.uid() = user_id);
