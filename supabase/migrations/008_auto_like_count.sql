-- Trigger to update product like_count when favorites change
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

-- Trigger after insert on favorites
DROP TRIGGER IF EXISTS trigger_update_like_count_insert ON public.favorites;
CREATE TRIGGER trigger_update_like_count_insert
  AFTER INSERT ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_product_like_count();

-- Trigger after delete on favorites
DROP TRIGGER IF EXISTS trigger_update_like_count_delete ON public.favorites;
CREATE TRIGGER trigger_update_like_count_delete
  AFTER DELETE ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.update_product_like_count();

-- Update existing products with correct like counts
UPDATE public.products p
SET like_count = f.like_count
FROM (SELECT product_id, COUNT(*) as like_count FROM public.favorites GROUP BY product_id) f
WHERE p.id = f.product_id;
