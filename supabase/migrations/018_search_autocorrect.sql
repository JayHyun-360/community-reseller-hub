-- Improve search_autocomplete scoring and return similarity scores
CREATE OR REPLACE FUNCTION public.search_autocomplete(q text)
RETURNS TABLE(kind text, id uuid, title text, username text, full_name text, avatar_url text, price numeric, images text[], score double precision)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  -- Products: score by similarity of title and description
  RETURN QUERY
  SELECT
    'product'::text AS kind,
    p.id,
    p.title,
    NULL::text,
    NULL::text,
    NULL::text,
    p.price,
    p.images,
    greatest(similarity(coalesce(p.title,''), q), similarity(coalesce(p.description,''), q))::double precision AS score
  FROM products p
  WHERE p.title ILIKE ('%'||q||'%') OR p.description ILIKE ('%'||q||'%') OR p.title % q OR p.description % q
  ORDER BY score DESC NULLS LAST
  LIMIT 10;

  -- Sellers: score by similarity of username and full_name
  RETURN QUERY
  SELECT
    'seller'::text AS kind,
    pr.id,
    NULL::text,
    pr.username,
    pr.full_name,
    pr.avatar_url,
    NULL::numeric,
    NULL::text[],
    greatest(similarity(coalesce(pr.username,''), q), similarity(coalesce(pr.full_name,''), q))::double precision AS score
  FROM profiles pr
  WHERE pr.role = 'seller' AND (pr.username ILIKE ('%'||q||'%') OR pr.full_name ILIKE ('%'||q||'%') OR pr.username % q OR pr.full_name % q)
  ORDER BY score DESC NULLS LAST
  LIMIT 10;
END;
$$;
