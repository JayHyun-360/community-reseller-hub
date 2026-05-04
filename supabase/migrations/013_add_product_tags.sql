-- Add tags column to products for keyword-based discovery
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create index for efficient tag searching
CREATE INDEX IF NOT EXISTS idx_products_tags 
ON public.products USING GIN(tags);

-- Add view_count for trending calculation
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
