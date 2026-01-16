-- =============================================
-- Portfolio Database Schema for Supabase
-- =============================================
-- Run this SQL in Supabase SQL Editor to create the database schema

-- =============================================
-- 1. Create Tables
-- =============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,        -- "web", "ai-video", "etc"
  label TEXT NOT NULL,             -- "Web", "AI Video", "Etc"
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  thumbnail TEXT NOT NULL,
  description TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project-Category junction table (N:M relationship)
CREATE TABLE IF NOT EXISTS project_categories (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (project_id, category_id)
);

-- Media table (1:N relationship with projects)
CREATE TABLE IF NOT EXISTS media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  src TEXT NOT NULL,
  alt TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. Create Indexes
-- =============================================

CREATE INDEX IF NOT EXISTS idx_categories_sort ON categories(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order DESC);
CREATE INDEX IF NOT EXISTS idx_project_categories_project ON project_categories(project_id);
CREATE INDEX IF NOT EXISTS idx_project_categories_category ON project_categories(category_id);
CREATE INDEX IF NOT EXISTS idx_media_project ON media(project_id);
CREATE INDEX IF NOT EXISTS idx_media_sort ON media(sort_order);

-- =============================================
-- 3. Create Triggers
-- =============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS projects_updated_at ON projects;
CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- 4. Row Level Security (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (for clean re-runs)
DROP POLICY IF EXISTS "Public read categories" ON categories;
DROP POLICY IF EXISTS "Public read published projects" ON projects;
DROP POLICY IF EXISTS "Public read project_categories" ON project_categories;
DROP POLICY IF EXISTS "Public read media" ON media;
DROP POLICY IF EXISTS "Admin full access categories" ON categories;
DROP POLICY IF EXISTS "Admin full access projects" ON projects;
DROP POLICY IF EXISTS "Admin full access project_categories" ON project_categories;
DROP POLICY IF EXISTS "Admin full access media" ON media;

-- Public read policies (for portfolio site)
CREATE POLICY "Public read categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Public read published projects" ON projects
  FOR SELECT USING (is_published = true);

CREATE POLICY "Public read project_categories" ON project_categories
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = project_categories.project_id AND is_published = true)
  );

CREATE POLICY "Public read media" ON media
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM projects WHERE id = media.project_id AND is_published = true)
  );

-- Authenticated user full access (for admin)
CREATE POLICY "Admin full access categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access project_categories" ON project_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access media" ON media
  FOR ALL USING (auth.role() = 'authenticated');

-- =============================================
-- 5. Storage Bucket Setup
-- =============================================

-- Create project-images bucket (run in Storage section or via SQL)
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DROP POLICY IF EXISTS "Public read images" ON storage.objects;
DROP POLICY IF EXISTS "Admin upload images" ON storage.objects;
DROP POLICY IF EXISTS "Admin update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin delete images" ON storage.objects;

CREATE POLICY "Public read images" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-images');

CREATE POLICY "Admin upload images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin update images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );

CREATE POLICY "Admin delete images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'project-images' AND auth.role() = 'authenticated'
  );

-- =============================================
-- 6. Initial Data (Categories)
-- =============================================

INSERT INTO categories (key, label, sort_order) VALUES
  ('web', 'Web', 1),
  ('ai-video', 'AI Video', 2),
  ('etc', 'Etc', 3)
ON CONFLICT (key) DO NOTHING;

-- =============================================
-- Done! Your database schema is ready.
--
-- Next steps:
-- 1. Create an admin user in Supabase Authentication
-- 2. Run the migration script: npx tsx scripts/migrate-data.ts
-- =============================================
