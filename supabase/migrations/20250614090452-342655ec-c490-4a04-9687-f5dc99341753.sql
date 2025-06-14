
-- Drop and recreate everything cleanly to fix the enum type issue
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing table if it exists to avoid conflicts
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop and recreate the enum types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.quest_status CASCADE;
DROP TYPE IF EXISTS public.quest_difficulty CASCADE;
DROP TYPE IF EXISTS public.post_type CASCADE;

-- Create enum types
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE public.quest_status AS ENUM ('locked', 'available', 'in_progress', 'completed');
CREATE TYPE public.quest_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.post_type AS ENUM ('question', 'discussion', 'study_group', 'tip');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role user_role DEFAULT 'admin',
  risk_coins INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  community_rank TEXT DEFAULT 'Beginner Actuarian',
  total_quests_completed INTEGER DEFAULT 0,
  sandbox_score INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create the trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    'admin'::user_role
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
