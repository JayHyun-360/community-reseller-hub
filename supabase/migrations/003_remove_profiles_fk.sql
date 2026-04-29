-- Remove FK constraint from profiles to allow manual seeding
-- Run this to fix the profiles table for development

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Now you can seed data or sign up with Google
-- Profiles will be created automatically via trigger when users sign up
