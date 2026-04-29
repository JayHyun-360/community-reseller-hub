-- Update categories with more meaningful options
DELETE FROM public.categories;

INSERT INTO public.categories (name, emoji, product_count) VALUES
  ('Keychains', '&#127873;', 0),
  ('Clothing', '&#129509;', 0),
  ('Electronics', '&#128187;', 0),
  ('Food & Drinks', '&#127856;', 0),
  ('Art & Prints', '&#127912;', 0),
  ('Home & Living', '&#127968;', 0),
  ('Beauty & Skincare', '&#129526;', 0),
  ('Books & Stationery', '&#128218;', 0),
  ('Sports & Outdoors', '&#127950;', 0),
  ('Pet Supplies', '&#128054;', 0),
  ('Vintage', '&#128220;', 0),
  ('Digital', '&#128190;', 0)
ON CONFLICT DO NOTHING;
