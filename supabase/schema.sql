-- ============================================================
-- SUPABASE DATABASE SCHEMA FOR KUMAILBHATT ART
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ============================================================
-- EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- SKETCHES TABLE
-- ============================================================
DROP TABLE IF EXISTS sketches CASCADE;

CREATE TABLE sketches (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  title         TEXT          NOT NULL,
  description   TEXT          NOT NULL DEFAULT '',
  price         DECIMAL(10,2) NOT NULL CHECK (price > 0),
  image_urls    TEXT[]        NOT NULL DEFAULT '{}',   -- up to 3 Supabase Storage URLs
  featured      BOOLEAN       NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ============================================================
-- AUTO-UPDATE updated_at ON EVERY UPDATE
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sketches_updated_at ON sketches;
CREATE TRIGGER sketches_updated_at
  BEFORE UPDATE ON sketches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE sketches ENABLE ROW LEVEL SECURITY;

-- Anyone can read sketches (gallery, homepage)
CREATE POLICY "Public can read sketches"
  ON sketches FOR SELECT
  USING (true);

-- Only service_role (admin dashboard) can insert/update/delete
-- The admin uses SUPABASE_SERVICE_ROLE_KEY which bypasses RLS
-- So these policies are a safety net for direct DB access
CREATE POLICY "Service role can insert"
  ON sketches FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can update"
  ON sketches FOR UPDATE
  USING (true);

CREATE POLICY "Service role can delete"
  ON sketches FOR DELETE
  USING (true);

-- ============================================================
-- STORAGE BUCKET: sketch-images
-- ============================================================
-- Step 1: Go to Supabase Dashboard → Storage → New Bucket
--   Name:   sketch-images
--   Public: YES (toggle ON)
--
-- Step 2: Run these storage policies:

-- Allow anyone to view/download images
CREATE POLICY "Public read sketch images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sketch-images');

-- Allow inserts (uploads) — service_role bypasses this
CREATE POLICY "Allow image uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'sketch-images');

-- Allow deletes — service_role bypasses this
CREATE POLICY "Allow image deletes"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'sketch-images');

-- ============================================================
-- NO SEED DATA — All sketches are managed via admin dashboard
-- ============================================================
