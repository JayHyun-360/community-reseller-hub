-- Add back status column (was removed in migration 010)
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';

-- Add draft status to products table
ALTER TABLE public.products ADD CONSTRAINT products_status_check 
  CHECK (status IN ('available', 'low', 'sold_out', 'draft'));
