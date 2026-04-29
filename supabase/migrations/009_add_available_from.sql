-- Add available_from column for pre-orders
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS available_from TIMESTAMPTZ;
