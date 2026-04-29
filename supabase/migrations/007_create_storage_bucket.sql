-- Create products storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_extensions)
VALUES ('products', 'products', true, 5242880, ARRAY['jpg', 'jpeg', 'png', 'gif', 'webp']);

-- Allow public read access to product images
CREATE POLICY "Public access to product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Allow authenticated users to upload product images
CREATE POLICY "Users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow users to delete their own product images
CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.role() = 'authenticated');
