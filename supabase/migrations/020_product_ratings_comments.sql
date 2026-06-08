-- ============================================
-- 020: Add product ratings and comments
-- Creates product_ratings and product_comments tables
-- with automatic aggregation triggers
-- ============================================

-- 1. Add columns to products table for rating aggregates
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS overall_rating DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comment_count INT DEFAULT 0;

-- 2. Create product_ratings table
CREATE TABLE IF NOT EXISTS public.product_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rating DECIMAL(2,1) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX IF NOT EXISTS product_ratings_product_id_idx ON public.product_ratings(product_id);
CREATE INDEX IF NOT EXISTS product_ratings_user_id_idx ON public.product_ratings(user_id);

-- 3. Create product_comments table
CREATE TABLE IF NOT EXISTS public.product_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS product_comments_product_id_idx ON public.product_comments(product_id, created_at DESC);
CREATE INDEX IF NOT EXISTS product_comments_user_id_idx ON public.product_comments(user_id);

-- 4. Trigger function to update overall_rating and rating_count
CREATE OR REPLACE FUNCTION public.update_product_rating_aggregate()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.products
    SET 
      overall_rating = (SELECT AVG(rating)::DECIMAL(3,1) FROM public.product_ratings WHERE product_id = OLD.product_id),
      rating_count = (SELECT COUNT(*) FROM public.product_ratings WHERE product_id = OLD.product_id),
      updated_at = NOW()
    WHERE id = OLD.product_id;
    RETURN OLD;
  ELSE
    UPDATE public.products
    SET 
      overall_rating = (SELECT AVG(rating)::DECIMAL(3,1) FROM public.product_ratings WHERE product_id = NEW.product_id),
      rating_count = (SELECT COUNT(*) FROM public.product_ratings WHERE product_id = NEW.product_id),
      updated_at = NOW()
    WHERE id = NEW.product_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_product_rating_aggregate ON public.product_ratings;
CREATE TRIGGER trg_update_product_rating_aggregate
  AFTER INSERT OR UPDATE OR DELETE ON public.product_ratings
  FOR EACH ROW EXECUTE FUNCTION public.update_product_rating_aggregate();

-- 5. Trigger function to update comment_count
CREATE OR REPLACE FUNCTION public.update_product_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    UPDATE public.products
    SET 
      comment_count = (SELECT COUNT(*) FROM public.product_comments WHERE product_id = OLD.product_id),
      updated_at = NOW()
    WHERE id = OLD.product_id;
    RETURN OLD;
  ELSE
    UPDATE public.products
    SET 
      comment_count = (SELECT COUNT(*) FROM public.product_comments WHERE product_id = NEW.product_id),
      updated_at = NOW()
    WHERE id = NEW.product_id;
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_product_comment_count ON public.product_comments;
CREATE TRIGGER trg_update_product_comment_count
  AFTER INSERT OR DELETE ON public.product_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_product_comment_count();

-- 6. Enable Row Level Security
ALTER TABLE public.product_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_comments ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for product_ratings
CREATE POLICY "Ratings are viewable by everyone"
  ON public.product_ratings FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own ratings"
  ON public.product_ratings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON public.product_ratings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ratings"
  ON public.product_ratings FOR DELETE
  USING (auth.uid() = user_id);

-- 8. RLS Policies for product_comments
CREATE POLICY "Comments are viewable by everyone"
  ON public.product_comments FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert own comments"
  ON public.product_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
  ON public.product_comments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.product_comments FOR DELETE
  USING (auth.uid() = user_id);
