
-- 1. Create the missing enum types, if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_status') THEN
    CREATE TYPE public.quest_status AS ENUM ('locked', 'available', 'in_progress', 'completed');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'quest_difficulty') THEN
    CREATE TYPE public.quest_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_type') THEN
    CREATE TYPE public.post_type AS ENUM ('question', 'discussion', 'study_group', 'tip');
  END IF;
END
$$;

-- 2. Drop and recreate the profiles table if it doesn't exist or is broken
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE public.profiles (
      id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      username TEXT UNIQUE,
      full_name TEXT,
      avatar_url TEXT,
      role user_role DEFAULT 'student',
      risk_coins INTEGER DEFAULT 0,
      current_streak INTEGER DEFAULT 0,
      community_rank TEXT DEFAULT 'Beginner Actuarian',
      total_quests_completed INTEGER DEFAULT 0,
      sandbox_score INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      PRIMARY KEY (id)
    );
  END IF;
END
$$;

-- 3. Create a trigger function to insert into profiles on new user sign up (no "admin" logic!)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.email)
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create the trigger if it does not exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created'
  )
  THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  END IF;
END
$$;
