-- Restore stock_qty column to products table
-- This was accidentally removed in migration 010

ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_qty INT DEFAULT 0;
