-- Fix update_product_like_count function to handle both INSERT/UPDATE and DELETE operations
CREATE OR REPLACE FUNCTION public.update_product_like_count()
RETURNS TRIGGER AS $$
DECLARE
  target_id UUID;
BEGIN
  IF TG_OP = 'DELETE' THEN
    target_id := OLD.product_id;
  ELSE
    target_id := NEW.product_id;
  END IF;

  UPDATE public.products
  SET like_count = (
    SELECT COUNT(*) FROM public.favorites WHERE product_id = target_id
  )
  WHERE id = target_id;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
