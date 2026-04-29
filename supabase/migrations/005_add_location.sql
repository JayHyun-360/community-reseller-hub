-- Add location field to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location TEXT;
