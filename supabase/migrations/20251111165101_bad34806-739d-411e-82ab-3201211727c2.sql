-- Fix security warnings from linter

-- 1. Fix function search paths for security definer functions
CREATE OR REPLACE FUNCTION public.update_restaurant_photo_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_photo_likes_count()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 2. Add has_role function for admin checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 3. Add admin policies for restaurants and roles
CREATE POLICY "Admins can update restaurants"
  ON public.restaurants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admins can manage achievements"
  ON public.achievements FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );