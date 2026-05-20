-- Migration to add Instagram and TikTok handles to public.profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS instagram_handle TEXT,
ADD COLUMN IF NOT EXISTS tiktok_handle TEXT;
