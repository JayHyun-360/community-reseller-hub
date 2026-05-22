-- ============================================
-- 019: Improve search across the system
-- Adds full-text search vectors (trigger-maintained),
-- tag-aware search, dedicated search RPCs for
-- products & sellers, and improves autocomplete.
-- ============================================

-- 1. FTS column on products (maintained by trigger)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS fts tsvector;

CREATE INDEX IF NOT EXISTS products_fts_idx ON public.products USING GIN (fts);

CREATE OR REPLACE FUNCTION public.products_fts_update() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('english', coalesce(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', coalesce(array_to_string(NEW.tags, ' '), '')), 'C');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_products_fts ON public.products;
CREATE TRIGGER trg_products_fts
  BEFORE INSERT OR UPDATE OF title, description, tags ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.products_fts_update();

-- Backfill existing rows
UPDATE public.products SET fts =
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(description, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(array_to_string(tags, ' '), '')), 'C');

-- 2. FTS column on profiles (maintained by trigger)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS fts tsvector;

CREATE INDEX IF NOT EXISTS profiles_fts_idx ON public.profiles USING GIN (fts);

CREATE OR REPLACE FUNCTION public.profiles_fts_update() RETURNS trigger
LANGUAGE plpgsql AS $$
BEGIN
  NEW.fts :=
    setweight(to_tsvector('simple', coalesce(NEW.username, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW.full_name, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(NEW.bio, '')), 'B');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_profiles_fts ON public.profiles;
CREATE TRIGGER trg_profiles_fts
  BEFORE INSERT OR UPDATE OF username, full_name, bio ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.profiles_fts_update();

-- Backfill existing rows
UPDATE public.profiles SET fts =
  setweight(to_tsvector('simple', coalesce(username, '')), 'A') ||
  setweight(to_tsvector('simple', coalesce(full_name, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(bio, '')), 'B');

-- 3. Improved search_autocomplete (tag search + FTS + draft exclusion)
DROP FUNCTION IF EXISTS public.search_autocomplete(text);

CREATE OR REPLACE FUNCTION public.search_autocomplete(q text)
RETURNS TABLE(
  kind text,
  id uuid,
  title text,
  username text,
  full_name text,
  avatar_url text,
  price numeric,
  images text[],
  score double precision,
  match_type text
)
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  tsq tsquery;
BEGIN
  tsq := websearch_to_tsquery('english', q);

  -- Products: prefix > token > tag > full-text > fuzzy
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
      WHEN lower(p.title) LIKE '% ' || lower(q) || '%' THEN 0.9
      WHEN p.tags @> ARRAY[lower(q)] THEN 0.85
      WHEN p.fts @@ tsq THEN 0.8 + ts_rank_cd(p.fts, tsq)::double precision
      ELSE greatest(
        similarity(coalesce(p.title,''), q),
        similarity(coalesce(p.description,''), q)
      )::double precision
    END AS score,
    CASE
      WHEN lower(p.title) LIKE lower(q) || '%' THEN 'starts'
      WHEN lower(p.title) LIKE '% ' || lower(q) || '%' THEN 'token'
      WHEN p.tags @> ARRAY[lower(q)] THEN 'tag'
      WHEN p.fts @@ tsq THEN 'fts'
      ELSE 'fuzzy'
    END AS match_type
  FROM products p
  WHERE p.status IS DISTINCT FROM 'draft'
    AND (
      lower(p.title) LIKE lower(q) || '%'
      OR lower(p.title) LIKE '% ' || lower(q) || '%'
      OR p.title ILIKE '%' || q || '%'
      OR p.description ILIKE '%' || q || '%'
      OR p.tags @> ARRAY[lower(q)]
      OR p.fts @@ tsq
      OR p.title % q
      OR p.description % q
    )
  ORDER BY score DESC NULLS LAST
  LIMIT 12;

  -- Sellers: prefix > token > full-text > fuzzy
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
      WHEN lower(pr.full_name) LIKE lower(q) || '%' THEN 0.95
      WHEN lower(pr.username) LIKE '% ' || lower(q) || '%' THEN 0.85
      WHEN pr.fts @@ websearch_to_tsquery('simple', q) THEN 0.8
      ELSE greatest(
        similarity(coalesce(pr.username,''), q),
        similarity(coalesce(pr.full_name,''), q)
      )::double precision
    END AS score,
    CASE
      WHEN lower(pr.username) LIKE lower(q) || '%' THEN 'starts'
      WHEN lower(pr.full_name) LIKE lower(q) || '%' THEN 'starts'
      WHEN lower(pr.username) LIKE '% ' || lower(q) || '%' THEN 'token'
      WHEN pr.fts @@ websearch_to_tsquery('simple', q) THEN 'fts'
      ELSE 'fuzzy'
    END AS match_type
  FROM profiles pr
  WHERE pr.role = 'seller' AND (
    lower(pr.username) LIKE lower(q) || '%'
    OR lower(pr.full_name) LIKE lower(q) || '%'
    OR lower(pr.username) LIKE '% ' || lower(q) || '%'
    OR pr.username ILIKE '%' || q || '%'
    OR pr.full_name ILIKE '%' || q || '%'
    OR pr.fts @@ websearch_to_tsquery('simple', q)
    OR pr.username % q
    OR pr.full_name % q
  )
  ORDER BY score DESC NULLS LAST
  LIMIT 12;
END;
$$;

-- 4. New RPC: search_products (server-side search with category filter + pagination)
CREATE OR REPLACE FUNCTION public.search_products(
  q text DEFAULT '',
  cat_id uuid DEFAULT NULL,
  result_limit int DEFAULT 50,
  result_offset int DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  seller_id uuid,
  category_id uuid,
  title text,
  description text,
  price numeric,
  images text[],
  stock_qty int,
  status text,
  is_featured boolean,
  like_count int,
  view_count int,
  tags text[],
  location text,
  created_at timestamptz,
  relevance double precision
)
LANGUAGE plpgsql STABLE
AS $$
DECLARE
  tsq tsquery;
BEGIN
  IF q IS NOT NULL AND q <> '' THEN
    tsq := websearch_to_tsquery('english', q);
  END IF;

  RETURN QUERY
  SELECT
    p.id,
    p.seller_id,
    p.category_id,
    p.title,
    p.description,
    p.price,
    p.images,
    p.stock_qty,
    p.status,
    p.is_featured,
    p.like_count,
    p.view_count,
    p.tags,
    p.location,
    p.created_at,
    CASE
      WHEN q IS NULL OR q = '' THEN 0.0::double precision
      WHEN lower(p.title) LIKE lower(q) || '%' THEN 1.0
      WHEN lower(p.title) LIKE '% ' || lower(q) || '%' THEN 0.9
      WHEN p.tags @> ARRAY[lower(q)] THEN 0.85
      WHEN tsq IS NOT NULL AND p.fts @@ tsq THEN (0.7 + ts_rank_cd(p.fts, tsq))::double precision
      ELSE greatest(
        similarity(coalesce(p.title,''), q),
        similarity(coalesce(p.description,''), q)
      )::double precision
    END AS relevance
  FROM products p
  WHERE p.status IS DISTINCT FROM 'draft'
    AND (cat_id IS NULL OR p.category_id = cat_id)
    AND (
      q IS NULL OR q = ''
      OR lower(p.title) LIKE lower(q) || '%'
      OR lower(p.title) LIKE '% ' || lower(q) || '%'
      OR p.title ILIKE '%' || q || '%'
      OR p.description ILIKE '%' || q || '%'
      OR p.tags @> ARRAY[lower(q)]
      OR (tsq IS NOT NULL AND p.fts @@ tsq)
      OR p.title % q
      OR p.description % q
    )
  ORDER BY
    CASE WHEN q IS NULL OR q = '' THEN p.created_at END DESC NULLS LAST,
    relevance DESC NULLS LAST
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;

-- 5. New RPC: search_sellers (server-side seller search with pagination)
CREATE OR REPLACE FUNCTION public.search_sellers(
  q text DEFAULT '',
  result_limit int DEFAULT 50,
  result_offset int DEFAULT 0
)
RETURNS TABLE(
  id uuid,
  username text,
  full_name text,
  avatar_url text,
  role text,
  whatsapp_num text,
  messenger_url text,
  instagram_handle text,
  tiktok_handle text,
  bio text,
  location text,
  created_at timestamptz,
  relevance double precision
)
LANGUAGE plpgsql STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pr.id,
    pr.username,
    pr.full_name,
    pr.avatar_url,
    pr.role,
    pr.whatsapp_num,
    pr.messenger_url,
    pr.instagram_handle,
    pr.tiktok_handle,
    pr.bio,
    pr.location,
    pr.created_at,
    CASE
      WHEN q IS NULL OR q = '' THEN 0.0::double precision
      WHEN lower(pr.username) LIKE lower(q) || '%' THEN 1.0
      WHEN lower(pr.full_name) LIKE lower(q) || '%' THEN 0.95
      WHEN lower(pr.username) LIKE '% ' || lower(q) || '%' THEN 0.85
      WHEN pr.fts @@ websearch_to_tsquery('simple', q) THEN 0.8
      ELSE greatest(
        similarity(coalesce(pr.username,''), q),
        similarity(coalesce(pr.full_name,''), q)
      )::double precision
    END AS relevance
  FROM profiles pr
  WHERE pr.role = 'seller'
    AND (
      q IS NULL OR q = ''
      OR lower(pr.username) LIKE lower(q) || '%'
      OR lower(pr.full_name) LIKE lower(q) || '%'
      OR lower(pr.username) LIKE '% ' || lower(q) || '%'
      OR pr.username ILIKE '%' || q || '%'
      OR pr.full_name ILIKE '%' || q || '%'
      OR pr.fts @@ websearch_to_tsquery('simple', q)
      OR pr.username % q
      OR pr.full_name % q
    )
  ORDER BY
    CASE WHEN q IS NULL OR q = '' THEN pr.created_at END DESC NULLS LAST,
    relevance DESC NULLS LAST
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;
