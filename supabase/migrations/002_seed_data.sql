-- Seed Data for Community Seller Hub

-- Note: Run this after 001_initial_schema.sql
-- The profiles will be created automatically via trigger when users sign up
-- Here we insert sample products for testing

-- First, let's create test seller profiles manually (for demo purposes)
-- In production, these would be created via signup

INSERT INTO public.profiles (id, username, full_name, avatar_url, role, trust_score, trust_tier, whatsapp_num, messenger_url, primary_color)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'kawaii_seller', 'Mika', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200', 'seller', 95, 'Verified', '+639123456789', NULL, '#E86FAA'),
  ('22222222-2222-2222-2222-222222222222', 'thrift_queen', 'Ana', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200', 'seller', 78, 'Rising', '+639987654321', NULL, '#8B5CF6'),
  ('33333333-3333-3333-3333-333333333333', 'crafty_mae', 'Mae', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200', 'seller', 62, 'Rising', '+639555555555', NULL, '#10B981')
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO public.products (seller_id, category_id, title, description, price, images, stock_qty, status, is_featured, view_count)
SELECT 
  p.id as seller_id,
  c.id as category_id,
  'Sanrio Keychain Set (5pcs)' as title,
  'Cute pastel Sanrio characters. BPA-free acrylic. Perfect for bags!' as description,
  129.00 as price,
  ARRAY['https://images.unsplash.com/photo-1606103920295-972888a6ce90?w=800'] as images,
  8 as stock_qty,
  'available' as status,
  true as is_featured,
  340 as view_count
FROM public.profiles p, public.categories c
WHERE p.username = 'kawaii_seller' AND c.name = 'Keychains'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (seller_id, category_id, title, description, price, images, stock_qty, status, is_featured, view_count)
SELECT 
  p.id,
  c.id,
  'Hello Kitty Mini Charm',
  'Limited edition HK charm. Fits most phone cases and bags.',
  89.00,
  ARRAY['https://images.unsplash.com/photo-1566576721346-d4a3b4eaad55?w=800'],
  2,
  'low',
  false,
  210
FROM public.profiles p, public.categories c
WHERE p.username = 'kawaii_seller' AND c.name = 'Keychains'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (seller_id, category_id, title, description, price, images, stock_qty, status, is_featured, view_count)
SELECT 
  p.id,
  c.id,
  'Y2K Denim Cargo Jacket',
  'Authentic Y2K vibes, great condition. Oversized fit.',
  320.00,
  ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800'],
  0,
  'sold_out',
  true,
  185
FROM public.profiles p, public.categories c
WHERE p.username = 'thrift_queen' AND c.name = 'Thrift'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (seller_id, category_id, title, description, price, images, stock_qty, status, is_featured, view_count)
SELECT 
  p.id,
  c.id,
  'Custom Clay Bag Tag',
  'Personalized with your name. Choose your colors!',
  150.00,
  ARRAY['https://images.unsplash.com/photo-1621360841013-c7683c659ec6?w=800'],
  15,
  'available',
  false,
  95
FROM public.profiles p, public.categories c
WHERE p.username = 'crafty_mae' AND c.name = 'Custom'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (seller_id, category_id, title, description, price, images, stock_qty, status, is_featured, view_count)
SELECT 
  p.id,
  c.id,
  'Cinnamoroll Plushie Clip',
  'Soft cinnamoroll clip for your backpack.',
  199.00,
  ARRAY['https://images.unsplash.com/photo-1559563458-527298cb2b42?w=800'],
  5,
  'available',
  false,
  420
FROM public.profiles p, public.categories c
WHERE p.username = 'kawaii_seller' AND c.name = 'Keychains'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (seller_id, category_id, title, description, price, images, stock_qty, status, is_featured, view_count)
SELECT 
  p.id,
  c.id,
  'Vintage Nirvana Band Tee',
  'Distressed look, size L. One of a kind finds.',
  450.00,
  ARRAY['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800'],
  1,
  'low',
  true,
  560
FROM public.profiles p, public.categories c
WHERE p.username = 'thrift_queen' AND c.name = 'Thrift'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (seller_id, category_id, title, description, price, images, stock_qty, status, is_featured, view_count)
SELECT 
  p.id,
  c.id,
  'Handmade Beaded Phone Strap',
  'Colorful Y2K style beaded strap with star charms.',
  120.00,
  ARRAY['https://images.unsplash.com/photo-1627250682845-66708990a423?w=800'],
  10,
  'available',
  false,
  150
FROM public.profiles p, public.categories c
WHERE p.username = 'crafty_mae' AND c.name = 'Accessories'
ON CONFLICT DO NOTHING;

INSERT INTO public.products (seller_id, category_id, title, description, price, images, stock_qty, status, is_featured, view_count)
SELECT 
  p.id,
  c.id,
  'Ghibli Inspired Sticker Pack',
  '10 waterproof stickers featuring your favorite characters.',
  75.00,
  ARRAY['https://images.unsplash.com/photo-1591522810850-58128c5fb089?w=800'],
  25,
  'available',
  true,
  890
FROM public.profiles p, public.categories c
WHERE p.username = 'kawaii_seller' AND c.name = 'Custom'
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO public.notifications (user_id, title, message, type, is_read)
SELECT 
  p.id,
  'New order received',
  'Someone purchased your Vintage Camera',
  'order',
  false
FROM public.profiles p WHERE p.username = 'kawaii_seller'
ON CONFLICT DO NOTHING;

INSERT INTO public.notifications (user_id, title, message, type, is_read)
SELECT 
  p.id,
  'Item restocked',
  'Your requested item is now available',
  'restock',
  false
FROM public.profiles p WHERE p.username = 'kawaii_seller'
ON CONFLICT DO NOTHING;

INSERT INTO public.notifications (user_id, title, message, type, is_read)
SELECT 
  p.id,
  'New message',
  'John D. sent you a message',
  'message',
  true
FROM public.profiles p WHERE p.username = 'thrift_queen'
ON CONFLICT DO NOTHING;
