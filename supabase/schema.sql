-- ============================================================
-- SUPABASE DATABASE SCHEMA FOR KUMAILBHATT ART
-- Run this in your Supabase SQL Editor
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SKETCHES TABLE (with multi-image support)
-- ============================================================
CREATE TABLE IF NOT EXISTS sketches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  image_urls TEXT[] NOT NULL DEFAULT '{}',   -- up to 3 image URLs
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sketches_updated_at
  BEFORE UPDATE ON sketches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE sketches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read sketches"
  ON sketches FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert"
  ON sketches FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update"
  ON sketches FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete"
  ON sketches FOR DELETE USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE BUCKET FOR SKETCH IMAGES
-- ============================================================
-- Run this in Supabase Dashboard → Storage → New Bucket:
-- Name: sketch-images
-- Public: YES (toggle on)

-- Then add these storage policies in SQL editor:

-- Allow public read of all images
CREATE POLICY "Public read sketch images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sketch-images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload sketch images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sketch-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated delete sketch images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'sketch-images' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA
-- ============================================================
INSERT INTO sketches (title, description, price, image_urls, featured) VALUES
  (
    'Portrait in Shadows',
    'A deeply expressive charcoal portrait capturing the interplay of light and shadow.',
    2500,
    ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=800&fit=crop'],
    true
  ),
  (
    'City in Lines',
    'An architectural ink sketch of a vibrant cityscape drawn with meticulous detail.',
    1800,
    ARRAY['https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=600&h=800&fit=crop'],
    true
  );
