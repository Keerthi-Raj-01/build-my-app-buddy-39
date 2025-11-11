-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- ============================================
-- USERS AND PROFILES (Phase 5)
-- ============================================

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  location GEOGRAPHY(POINT, 4326),
  preferences JSONB DEFAULT '{}'::jsonb,
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- ============================================
-- RESTAURANTS (Phase 6)
-- ============================================

-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  location GEOGRAPHY(POINT, 4326),
  cuisine_type TEXT[],
  price_range INTEGER CHECK (price_range BETWEEN 1 AND 4),
  phone TEXT,
  hours JSONB,
  average_rating DECIMAL(3,2) DEFAULT 0,
  photo_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create restaurant_photos table
CREATE TABLE public.restaurant_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  tags TEXT[],
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DISCOUNTS (Phase 6)
-- ============================================

-- Create discounts table
CREATE TABLE public.discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE NOT NULL,
  photo_id UUID REFERENCES public.restaurant_photos(id) ON DELETE SET NULL,
  discount_percentage INTEGER DEFAULT 5,
  qr_code TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMMUNITY FEATURES (Phase 7 prep)
-- ============================================

-- Create user_follows table
CREATE TABLE public.user_follows (
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Create photo_likes table
CREATE TABLE public.photo_likes (
  photo_id UUID REFERENCES public.restaurant_photos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (photo_id, user_id)
);

-- Create photo_comments table
CREATE TABLE public.photo_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  photo_id UUID REFERENCES public.restaurant_photos(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon_url TEXT,
  points_required INTEGER DEFAULT 0,
  badge_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE public.user_achievements (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_profiles_location ON public.profiles USING GIST(location);
CREATE INDEX idx_restaurants_location ON public.restaurants USING GIST(location);
CREATE INDEX idx_restaurant_photos_restaurant_id ON public.restaurant_photos(restaurant_id);
CREATE INDEX idx_restaurant_photos_user_id ON public.restaurant_photos(user_id);
CREATE INDEX idx_restaurant_photos_timestamp ON public.restaurant_photos(timestamp DESC);
CREATE INDEX idx_discounts_user_id ON public.discounts(user_id);
CREATE INDEX idx_discounts_expires_at ON public.discounts(expires_at);
CREATE INDEX idx_photo_comments_photo_id ON public.photo_comments(photo_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'display_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Function to update restaurant photo count
CREATE OR REPLACE FUNCTION public.update_restaurant_photo_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.restaurants
    SET photo_count = photo_count + 1
    WHERE id = NEW.restaurant_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.restaurants
    SET photo_count = GREATEST(0, photo_count - 1)
    WHERE id = OLD.restaurant_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Function to update photo likes count
CREATE OR REPLACE FUNCTION public.update_photo_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE public.restaurant_photos
    SET likes_count = likes_count + 1
    WHERE id = NEW.photo_id;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE public.restaurant_photos
    SET likes_count = GREATEST(0, likes_count - 1)
    WHERE id = OLD.photo_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Triggers for updated_at timestamps
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_restaurants_updated_at
  BEFORE UPDATE ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger for restaurant photo count
CREATE TRIGGER update_restaurant_photo_count_trigger
  AFTER INSERT OR DELETE ON public.restaurant_photos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_restaurant_photo_count();

-- Trigger for photo likes count
CREATE TRIGGER update_photo_likes_count_trigger
  AFTER INSERT OR DELETE ON public.photo_likes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_photo_likes_count();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles policies
CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

-- Restaurants policies
CREATE POLICY "Restaurants are viewable by everyone"
  ON public.restaurants FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create restaurants"
  ON public.restaurants FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Restaurant photos policies
CREATE POLICY "Photos are viewable by everyone"
  ON public.restaurant_photos FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can upload photos"
  ON public.restaurant_photos FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own photos"
  ON public.restaurant_photos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own photos"
  ON public.restaurant_photos FOR DELETE
  USING (auth.uid() = user_id);

-- Discounts policies
CREATE POLICY "Users can view own discounts"
  ON public.discounts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System can create discounts"
  ON public.discounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own discounts"
  ON public.discounts FOR UPDATE
  USING (auth.uid() = user_id);

-- User follows policies
CREATE POLICY "Follows are viewable by everyone"
  ON public.user_follows FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own follows"
  ON public.user_follows FOR ALL
  USING (auth.uid() = follower_id);

-- Photo likes policies
CREATE POLICY "Likes are viewable by everyone"
  ON public.photo_likes FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own likes"
  ON public.photo_likes FOR ALL
  USING (auth.uid() = user_id);

-- Photo comments policies
CREATE POLICY "Comments are viewable by everyone"
  ON public.photo_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON public.photo_comments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.photo_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.photo_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Achievements policies
CREATE POLICY "Achievements are viewable by everyone"
  ON public.achievements FOR SELECT
  USING (true);

-- User achievements policies
CREATE POLICY "User achievements are viewable by everyone"
  ON public.user_achievements FOR SELECT
  USING (true);

CREATE POLICY "System can award achievements"
  ON public.user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================

-- Create storage bucket for restaurant photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'restaurant-photos',
  'restaurant-photos',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/heic']
);

-- Create storage bucket for user avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'avatars',
  'avatars',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
);

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Restaurant photos storage policies
CREATE POLICY "Restaurant photos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'restaurant-photos');

CREATE POLICY "Authenticated users can upload restaurant photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'restaurant-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own restaurant photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'restaurant-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own restaurant photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'restaurant-photos' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Avatar storage policies
CREATE POLICY "Avatars are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );