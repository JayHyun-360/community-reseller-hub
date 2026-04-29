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
  ('Livestock', '&#128004;', 0),
  ('Plants & Garden', '&#127793;', 0),
  ('Vintage', '&#128220;', 0),
  ('Digital', '&#128190;', 0),
  ('Custom Made', '&#128736;', 0),
  ('Toys & Games', '&#127918;', 0),
  ('Music & Instruments', '&#127928;', 0),
  ('Jewelry', '&#128141;', 0),
  ('Bags & Bags', '&#128092;', 0),
  ('Other', '&#128196;', 0)
ON CONFLICT DO NOTHING;
