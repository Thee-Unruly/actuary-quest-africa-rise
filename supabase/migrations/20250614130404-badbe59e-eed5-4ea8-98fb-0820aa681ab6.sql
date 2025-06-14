
-- Change the default role for new users to 'student'
ALTER TABLE public.profiles ALTER COLUMN role SET DEFAULT 'student'::public.user_role;

-- Set all existing users to 'student' role as a baseline
UPDATE public.profiles SET role = 'student';

-- Explicitly set the primary admin user's role to 'admin'
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@gmail.com' LIMIT 1);


-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile.
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

-- Policy: Users can update their own profile.
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Admins can view all profiles.
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role);


-- Enable RLS on quests table
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage all quests.
CREATE POLICY "Admins can manage quests"
ON public.quests FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role)
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role);

-- Policy: Authenticated users can read all quests.
CREATE POLICY "Authenticated users can read quests"
ON public.quests FOR SELECT
TO authenticated
USING (true);


-- Enable RLS on quest_categories table
ALTER TABLE public.quest_categories ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can manage all quest categories.
CREATE POLICY "Admins can manage quest categories"
ON public.quest_categories FOR ALL
USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role)
WITH CHECK ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'::public.user_role);

-- Policy: Authenticated users can read all quest categories.
CREATE POLICY "Authenticated users can read quest categories"
ON public.quest_categories FOR SELECT
TO authenticated
USING (true);
