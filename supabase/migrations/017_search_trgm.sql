-- Enable trigram extension and create search_autocomplete function
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create trigram indexes for faster similarity searches
CREATE INDEX IF NOT EXISTS products_title_trgm_idx ON products USING gin (title gin_trgm_ops);
CREATE INDEX IF NOT EXISTS products_description_trgm_idx ON products USING gin (description gin_trgm_ops);
CREATE INDEX IF NOT EXISTS profiles_username_trgm_idx ON profiles USING gin (username gin_trgm_ops);
CREATE INDEX IF NOT EXISTS profiles_fullname_trgm_idx ON profiles USING gin (full_name gin_trgm_ops);

-- Function to return product and seller suggestions ordered by similarity
CREATE OR REPLACE FUNCTION public.search_autocomplete(q text)
RETURNS TABLE(kind text, id uuid, title text, username text, full_name text, avatar_url text, price numeric, images text[])
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT 'product'::text AS kind, p.id, p.title, NULL, NULL, NULL, p.price, p.images
  FROM products p
  WHERE p.title ILIKE ('%'||q||'%') OR p.description ILIKE ('%'||q||'%')
  ORDER BY greatest(similarity(p.title, q), similarity(coalesce(p.description,''), q)) DESC
  LIMIT 8;

  RETURN QUERY
  SELECT 'seller'::text AS kind, pr.id, NULL, pr.username, pr.full_name, pr.avatar_url, NULL, NULL
  FROM profiles pr
  WHERE pr.role = 'seller' AND (pr.username ILIKE ('%'||q||'%') OR pr.full_name ILIKE ('%'||q||'%'))
  ORDER BY greatest(similarity(pr.username, q), similarity(coalesce(pr.full_name,''), q)) DESC
  LIMIT 8;
END;
$$;
