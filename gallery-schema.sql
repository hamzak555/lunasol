-- Gallery table for storing images and videos
CREATE TABLE IF NOT EXISTS gallery (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for position ordering
CREATE INDEX IF NOT EXISTS idx_gallery_position ON gallery(position);

-- Enable RLS
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

-- Allow public read access
DROP POLICY IF EXISTS "Allow public read access" ON gallery;
CREATE POLICY "Allow public read access"
  ON gallery FOR SELECT
  USING (true);

-- Allow authenticated users to insert
DROP POLICY IF EXISTS "Allow authenticated insert" ON gallery;
CREATE POLICY "Allow authenticated insert"
  ON gallery FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow authenticated users to update
DROP POLICY IF EXISTS "Allow authenticated update" ON gallery;
CREATE POLICY "Allow authenticated update"
  ON gallery FOR UPDATE
  TO authenticated
  USING (true);

-- Allow authenticated users to delete
DROP POLICY IF EXISTS "Allow authenticated delete" ON gallery;
CREATE POLICY "Allow authenticated delete"
  ON gallery FOR DELETE
  TO authenticated
  USING (true);
