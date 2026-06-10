-- ============================================
-- 021: Add notification triggers for ratings and comments
-- Creates triggers to notify sellers when users rate or comment on their products
-- ============================================

-- 1. Create trigger function for rating notifications
CREATE OR REPLACE FUNCTION public.notify_on_rating()
RETURNS TRIGGER AS $$
DECLARE
  seller_uuid UUID;
  product_title TEXT;
  rater_username TEXT;
  is_update BOOLEAN;
BEGIN
  -- Get the product's seller and title
  SELECT seller_id, title INTO seller_uuid, product_title
  FROM public.products
  WHERE id = NEW.product_id;

  -- Get the rater's username
  SELECT username INTO rater_username
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Determine if this is an insert (new) or update (existing)
  is_update := (TG_OP = 'UPDATE');

  -- Don't notify if user rates their own product (shouldn't happen due to API check)
  IF seller_uuid = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Create notification for the seller
  INSERT INTO public.notifications (user_id, title, message, type, product_id)
  VALUES (
    seller_uuid,
    CASE 
      WHEN is_update THEN '⭐ Rating updated on your product'
      ELSE '⭐ New rating on your product'
    END,
    CASE 
      WHEN rater_username IS NOT NULL 
      THEN rater_username || ' rated your "' || product_title || '" ' || NEW.rating || '★'
      ELSE 'Someone rated your "' || product_title || '" ' || NEW.rating || '★'
    END,
    'rating',
    NEW.product_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on product_ratings for both INSERT and UPDATE
DROP TRIGGER IF EXISTS trigger_notify_on_rating ON public.product_ratings;
CREATE TRIGGER trigger_notify_on_rating
  AFTER INSERT OR UPDATE ON public.product_ratings
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_rating();

-- 2. Create trigger function for comment notifications
CREATE OR REPLACE FUNCTION public.notify_on_comment()
RETURNS TRIGGER AS $$
DECLARE
  seller_uuid UUID;
  product_title TEXT;
  commenter_username TEXT;
  comment_preview TEXT;
BEGIN
  -- Get the product's seller and title
  SELECT seller_id, title INTO seller_uuid, product_title
  FROM public.products
  WHERE id = NEW.product_id;

  -- Get the commenter's username
  SELECT username INTO commenter_username
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Create a preview of the comment (first 80 chars)
  comment_preview := CASE 
    WHEN LENGTH(NEW.comment_text) > 80 
    THEN SUBSTRING(NEW.comment_text, 1, 80) || '...'
    ELSE NEW.comment_text
  END;

  -- Don't notify if user comments on their own product (shouldn't happen due to API check)
  IF seller_uuid = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Create notification for the seller
  INSERT INTO public.notifications (user_id, title, message, type, product_id)
  VALUES (
    seller_uuid,
    '💬 New comment on your product',
    CASE 
      WHEN commenter_username IS NOT NULL 
      THEN commenter_username || ': "' || comment_preview || '"'
      ELSE '"' || comment_preview || '"'
    END,
    'comment',
    NEW.product_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on product_comments for INSERT
DROP TRIGGER IF EXISTS trigger_notify_on_comment ON public.product_comments;
CREATE TRIGGER trigger_notify_on_comment
  AFTER INSERT ON public.product_comments
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_comment();

-- 3. Ensure RLS policy allows triggers to insert notifications
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- ============================================
-- DONE: Migration 021 complete
-- ============================================
