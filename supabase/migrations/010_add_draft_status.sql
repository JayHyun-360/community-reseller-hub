-- Add draft status to products table
ALTER TABLE public.products DROP CONSTRAINT products_status_check;
ALTER TABLE public.products ADD CONSTRAINT products_status_check 
  CHECK (status IN ('available', 'low', 'sold_out', 'draft'));
