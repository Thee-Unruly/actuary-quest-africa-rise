
-- Create enum types for better data integrity
CREATE TYPE public.quest_status AS ENUM ('locked', 'available', 'in_progress', 'completed');
CREATE TYPE public.quest_difficulty AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE public.user_role AS ENUM ('student', 'instructor', 'admin');
CREATE TYPE public.post_type AS ENUM ('question', 'discussion', 'study_group', 'tip');

-- Create profiles table for user data
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

-- Create learning quest categories
CREATE TABLE public.quest_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create individual learning quests
CREATE TABLE public.quests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.quest_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  difficulty quest_difficulty DEFAULT 'beginner',
  reward_coins INTEGER DEFAULT 0,
  estimated_time TEXT,
  prerequisites TEXT[], -- Array of quest IDs that must be completed first
  content JSONB, -- Quest content, questions, etc.
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track user progress on quests
CREATE TABLE public.user_quest_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES public.quests(id) ON DELETE CASCADE,
  status quest_status DEFAULT 'available',
  score INTEGER DEFAULT 0,
  max_score INTEGER DEFAULT 100,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  progress_data JSONB, -- Store detailed progress, answers, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- News categories for the sandbox/news section
CREATE TABLE public.news_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- News articles
CREATE TABLE public.news_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.news_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT,
  external_url TEXT,
  source TEXT,
  author TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community posts
CREATE TABLE public.community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  post_type post_type DEFAULT 'discussion',
  tags TEXT[],
  likes_count INTEGER DEFAULT 0,
  replies_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community post replies
CREATE TABLE public.community_replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  parent_reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track user likes on posts and replies
CREATE TABLE public.user_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.community_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_like_target CHECK (
    (post_id IS NOT NULL AND reply_id IS NULL) OR 
    (post_id IS NULL AND reply_id IS NOT NULL)
  ),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, reply_id)
);

-- User achievements/badges
CREATE TABLE public.achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  badge_color TEXT,
  criteria JSONB, -- Conditions to unlock the achievement
  reward_coins INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Track user achievements
CREATE TABLE public.user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, achievement_id)
);

-- User activity log for tracking engagement
CREATE TABLE public.user_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL, -- 'quest_completed', 'post_created', 'login', etc.
  activity_data JSONB,
  coins_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for quest categories and quests (public read)
CREATE POLICY "Anyone can view quest categories" ON public.quest_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view active quests" ON public.quests FOR SELECT USING (is_active = true);

-- RLS Policies for user quest progress
CREATE POLICY "Users can view own quest progress" ON public.user_quest_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quest progress" ON public.user_quest_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own quest progress" ON public.user_quest_progress FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for news
CREATE POLICY "Anyone can view news categories" ON public.news_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view news articles" ON public.news_articles FOR SELECT USING (true);

-- RLS Policies for community features
CREATE POLICY "Anyone can view community posts" ON public.community_posts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create posts" ON public.community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.community_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view community replies" ON public.community_replies FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create replies" ON public.community_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own replies" ON public.community_replies FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.community_replies FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own likes" ON public.user_likes FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for achievements
CREATE POLICY "Anyone can view achievements" ON public.achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Users can view own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user activities
CREATE POLICY "Users can view own activities" ON public.user_activities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activities" ON public.user_activities FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'username',
    new.raw_user_meta_data->>'full_name'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Function to update quest completion counts
CREATE OR REPLACE FUNCTION public.update_quest_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Update user's total completed quests
    UPDATE public.profiles 
    SET total_quests_completed = total_quests_completed + 1,
        risk_coins = risk_coins + (SELECT reward_coins FROM public.quests WHERE id = NEW.quest_id)
    WHERE id = NEW.user_id;
    
    -- Log the activity
    INSERT INTO public.user_activities (user_id, activity_type, activity_data, coins_earned)
    VALUES (
      NEW.user_id, 
      'quest_completed', 
      jsonb_build_object('quest_id', NEW.quest_id),
      (SELECT reward_coins FROM public.quests WHERE id = NEW.quest_id)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for quest completion updates
CREATE TRIGGER on_quest_progress_update
  AFTER UPDATE ON public.user_quest_progress
  FOR EACH ROW EXECUTE PROCEDURE public.update_quest_completion();

-- Insert sample data for quest categories
INSERT INTO public.quest_categories (name, description, icon, color, sort_order) VALUES
('Risk Assessment', 'Learn fundamental risk assessment techniques', 'Shield', '#ef4444', 1),
('Insurance Pricing', 'Master insurance pricing models and strategies', 'Calculator', '#3b82f6', 2),
('Life Insurance', 'Explore life insurance principles and calculations', 'Heart', '#10b981', 3),
('Property Insurance', 'Understand property and casualty insurance', 'Home', '#f59e0b', 4),
('Data Analytics', 'Master data analysis techniques for actuarial science', 'BarChart', '#8b5cf6', 5),
('Data Science', 'Advanced data science applications in insurance', 'Database', '#06b6d4', 6),
('ML & AI', 'Machine learning and AI in actuarial practice', 'Brain', '#ec4899', 7),
('Big Data', 'Handle and analyze large datasets', 'HardDrive', '#84cc16', 8);

-- Insert sample data for news categories
INSERT INTO public.news_categories (name, description, sort_order) VALUES
('IFRS 17', 'International Financial Reporting Standard 17 updates', 1),
('Climate Risk', 'Climate change impacts on insurance', 2),
('Digital Transformation', 'Technology in actuarial science', 3),
('Regulatory Updates', 'Latest regulatory changes', 4),
('Machine Learning', 'AI and ML in insurance', 5),
('Market Trends', 'Industry trends and analysis', 6);
