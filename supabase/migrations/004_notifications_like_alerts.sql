-- Add product_id to notifications for tracking which product triggered the notification
ALTER TABLE public.notifications 
ADD COLUMN IF NOT EXISTS product_id UUID REFERENCES public.products(id) ON DELETE CASCADE;

-- Add INSERT policy so triggers can create notifications
DROP POLICY IF EXISTS "Users can insert notifications" ON public.notifications;
CREATE POLICY "Users can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (true);

-- Create trigger function to notify sellers when someone likes their product
CREATE OR REPLACE FUNCTION public.notify_on_like()
RETURNS TRIGGER AS $$
DECLARE
  seller_uuid UUID;
  product_title TEXT;
  liker_username TEXT;
BEGIN
  -- Get the product's seller
  SELECT seller_id, title INTO seller_uuid, product_title
  FROM public.products
  WHERE id = NEW.product_id;

  -- Get the liker's username
  SELECT username INTO liker_username
  FROM public.profiles
  WHERE id = NEW.user_id;

  -- Don't notify if user likes their own product
  IF seller_uuid = NEW.user_id THEN
    RETURN NEW;
  END IF;

  -- Create notification for the seller
  INSERT INTO public.notifications (user_id, title, message, type, product_id)
  VALUES (
    seller_uuid,
    '❤️ New like on your product',
    CASE 
      WHEN liker_username IS NOT NULL 
      THEN liker_username || ' liked your "' || product_title || '"'
      ELSE 'Someone liked your "' || product_title || '"'
    END,
    'like',
    NEW.product_id
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger on favorites table
DROP TRIGGER IF EXISTS trigger_notify_on_like ON public.favorites;
CREATE TRIGGER trigger_notify_on_like
  AFTER INSERT ON public.favorites
  FOR EACH ROW EXECUTE FUNCTION public.notify_on_like();
