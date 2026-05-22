-- Improve search_autocomplete scoring and return similarity scores
-- Drop any existing function with the same signature to allow type changes
DROP FUNCTION IF EXISTS public.search_autocomplete(text);

CREATE OR REPLACE FUNCTION public.search_autocomplete(q text)
RETURNS TABLE(kind text, id uuid, title text, username text, full_name text, avatar_url text, price numeric, images text[], score double precision, match_type text)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  -- Products: prefix matches first, then token matches, then fuzzy similarity
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
    CASE
      WHEN lower(p.title) LIKE lower(q) || '%' THEN 1.0
      WHEN lower(p.title) LIKE '% ' || lower(q) || '%' THEN 0.85
      ELSE greatest(similarity(coalesce(p.title,''), q), similarity(coalesce(p.description,''), q))::double precision
    END AS score,
    CASE
      WHEN lower(p.title) LIKE lower(q) || '%' THEN 'starts'
      WHEN lower(p.title) LIKE '% ' || lower(q) || '%' THEN 'token'
      ELSE 'fuzzy'
    END AS match_type
  FROM products p
  WHERE (lower(p.title) LIKE lower(q) || '%')
     OR (lower(p.title) LIKE '% ' || lower(q) || '%')
     OR p.title ILIKE ('%'||q||'%')
     OR p.description ILIKE ('%'||q||'%')
     OR p.title % q
     OR p.description % q
  ORDER BY score DESC NULLS LAST
  LIMIT 12;

  -- Sellers: prefix and token matching then fuzzy
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
    CASE
      WHEN lower(pr.username) LIKE lower(q) || '%' THEN 1.0
      WHEN lower(pr.username) LIKE '% ' || lower(q) || '%' THEN 0.85
      ELSE greatest(similarity(coalesce(pr.username,''), q), similarity(coalesce(pr.full_name,''), q))::double precision
    END AS score,
    CASE
      WHEN lower(pr.username) LIKE lower(q) || '%' THEN 'starts'
      WHEN lower(pr.username) LIKE '% ' || lower(q) || '%' THEN 'token'
      ELSE 'fuzzy'
    END AS match_type
  FROM profiles pr
  WHERE pr.role = 'seller' AND (
    lower(pr.username) LIKE lower(q) || '%'
    OR lower(pr.username) LIKE '% ' || lower(q) || '%'
    OR pr.username ILIKE ('%'||q||'%')
    OR pr.full_name ILIKE ('%'||q||'%')
    OR pr.username % q
    OR pr.full_name % q
  )
  ORDER BY score DESC NULLS LAST
  LIMIT 12;
END;
$$;
