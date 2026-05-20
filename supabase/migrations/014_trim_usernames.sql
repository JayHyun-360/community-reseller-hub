-- Migration: Trim existing usernames and add a trigger to always trim on insert/update

-- 1. Trim existing usernames in the profiles table
UPDATE public.profiles SET username = TRIM(username);

-- 2. Create or replace a function to trim username values
CREATE OR REPLACE FUNCTION public.trim_username_on_upsert()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.username IS NOT NULL THEN
    NEW.username := TRIM(NEW.username);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Bind the trigger to run BEFORE INSERT or UPDATE on profiles
CREATE OR REPLACE TRIGGER tr_trim_username
BEFORE INSERT OR UPDATE OF username ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.trim_username_on_upsert();
