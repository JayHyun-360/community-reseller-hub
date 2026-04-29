-- Remove irrelevant seller fields that don't make sense for discovery-only platform
-- No transactions = no trust scores, trades, or verification

ALTER TABLE public.profiles DROP COLUMN IF EXISTS trust_score;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS trust_tier;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS trades_count;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS id_verified;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS primary_color;

-- Also remove from products (stock/status not relevant without transactions)
ALTER TABLE public.products DROP COLUMN IF EXISTS stock_qty;
ALTER TABLE public.products DROP COLUMN IF EXISTS status;
