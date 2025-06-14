
-- Set user with email admin@gmail.com to admin role
UPDATE public.profiles
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'admin@gmail.com');
