-- Drop view_count column and add like_count column
ALTER TABLE public.products DROP COLUMN IF EXISTS view_count;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS like_count INT DEFAULT 0;

-- Create function to update like_count
CREATE OR REPLACE FUNCTION public.update_product_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.products
  SET like_count = (
    SELECT COUNT(*) FROM public.favorites WHERE product_id = NEW.product_id
  )
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update like_count on favorite insert
DROP TRIGGER IF EXISTS on_favorite_insert ON public.favorites;
CREATE TRIGGER on_favorite_insert
  AFTER INSERT ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_product_like_count();

-- Create trigger to update like_count on favorite delete
DROP TRIGGER IF EXISTS on_favorite_delete ON public.favorites;
CREATE TRIGGER on_favorite_delete
  AFTER DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_product_like_count();

-- Update existing products with current like counts
UPDATE public.products p
SET like_count = (
  SELECT COUNT(*) FROM public.favorites f WHERE f.product_id = p.id
);
