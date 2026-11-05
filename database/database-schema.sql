-- Supabase Database Schema for Poster Project
-- Run these commands in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Templates Table
CREATE TABLE IF NOT EXISTS templates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    business_type TEXT DEFAULT 'all', -- Business classification: coaching, restaurant, clothing, etc.
    bg_color TEXT DEFAULT '#ffffff',
    text_color TEXT DEFAULT '#000000',
    elements JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security for templates (public read-only)
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access" ON templates;
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON templates;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON templates;

CREATE POLICY "Allow public read access" ON templates
    FOR SELECT TO public USING (true);

CREATE POLICY "Allow authenticated users to insert" ON templates
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update" ON templates
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- User Projects Table
CREATE TABLE IF NOT EXISTS user_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT 'Untitled Project',
    business_type TEXT DEFAULT 'all', -- User's selected business type
    background TEXT DEFAULT '#ffffff',
    elements JSONB DEFAULT '[]'::jsonb,
    width INTEGER DEFAULT 800,
    height INTEGER DEFAULT 600,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security for user_projects
ALTER TABLE user_projects ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can only access their own projects" ON user_projects;

CREATE POLICY "Users can only access their own projects" ON user_projects
    FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
DROP TRIGGER IF EXISTS update_templates_updated_at ON templates;
CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_user_projects_updated_at ON user_projects;
CREATE TRIGGER update_user_projects_updated_at BEFORE UPDATE ON user_projects
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
DROP INDEX IF EXISTS idx_templates_category;
CREATE INDEX idx_templates_category ON templates(category);

DROP INDEX IF EXISTS idx_templates_created_at;
CREATE INDEX idx_templates_created_at ON templates(created_at DESC);

DROP INDEX IF EXISTS idx_user_projects_user_id;
CREATE INDEX idx_user_projects_user_id ON user_projects(user_id);

DROP INDEX IF EXISTS idx_user_projects_updated_at;
CREATE INDEX idx_user_projects_updated_at ON user_projects(updated_at DESC);

-- Sample Data Insert (Optional - remove if not needed)
-- Uncomment and modify the following lines to add sample templates

/*
INSERT INTO templates (name, category, bg_color, text_color, elements) VALUES
('YouTube Tech Thumbnail', 'youtube', '#0f172a', '#ffffff', '[
    {"type": "text", "text": "🚀 NEW TECH VIDEO", "fontSize": 32, "fontWeight": "700", "fontFamily": "Space Grotesk", "textColor": "#ef4444", "x": 200, "y": 150, "width": 400, "height": 50},
    {"type": "text", "text": "Amazing Tech Review", "fontSize": 48, "fontWeight": "800", "fontFamily": "Space Grotesk", "textColor": "#ffffff", "x": 200, "y": 250, "width": 400, "height": 80}
]'::jsonb),

('Instagram Fashion Post', 'instagram', '#fef3c7', '#000000', '[
    {"type": "text", "text": "👗 Summer Collection", "fontSize": 36, "fontWeight": "700", "fontFamily": "Playfair Display", "textColor": "#1f2937", "x": 200, "y": 180, "width": 400, "height": 60},
    {"type": "text", "text": "NEW ARRIVALS", "fontSize": 28, "fontWeight": "600", "fontFamily": "Montserrat", "textColor": "#dc2626", "x": 200, "y": 300, "width": 400, "height": 50}
]'::jsonb),

('Facebook Business Cover', 'facebook', '#2563eb', '#ffffff', '[
    {"type": "text", "text": "🏢 Your Business", "fontSize": 48, "fontWeight": "700", "fontFamily": "Montserrat", "textColor": "#ffffff", "x": 400, "y": 200, "width": 400, "height": 80},
    {"type": "text", "text": "Professional Services", "fontSize": 24, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#bfdbfe", "x": 400, "y": 320, "width": 400, "height": 40}
]'::jsonb);
*/

-- Storage Bucket Setup (Run this in Storage section or SQL Editor)
-- Create a bucket for storing banner images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('banners', 'Banner Images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to banner images
DROP POLICY IF EXISTS "Allow public access to banner images" ON storage.objects;

CREATE POLICY "Allow public access to banner images" ON storage.objects
    FOR SELECT TO public USING (bucket_id = 'banners');

-- Allow authenticated users to upload banner images
DROP POLICY IF EXISTS "Allow authenticated users to upload banner images" ON storage.objects;

CREATE POLICY "Allow authenticated users to upload banner images" ON storage.objects
    FOR INSERT TO authenticated WITH CHECK (bucket_id = 'banners');

-- Enable Real-time for tables (optional, for live updates)
BEGIN;
    -- Add tables to realtime publication
    ALTER PUBLICATION supabase_realtime ADD TABLE templates;
    ALTER PUBLICATION supabase_realtime ADD TABLE user_projects;
COMMIT;

-- Business Details Table (User's business information)
CREATE TABLE IF NOT EXISTS business_details (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL DEFAULT '',
    business_type TEXT DEFAULT 'all',
    tagline TEXT DEFAULT '',
    color TEXT DEFAULT '#7c3aed',
    phone TEXT DEFAULT '',
    website TEXT DEFAULT '',
    email TEXT DEFAULT '',
    address TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    UNIQUE(user_id)
);

-- Enable Row Level Security for business_details
ALTER TABLE business_details ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Users can only access their own business details" ON business_details;

CREATE POLICY "Users can only access their own business details" ON business_details
    FOR ALL TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Trigger to auto-update updated_at for business_details
DROP TRIGGER IF EXISTS update_business_details_updated_at ON business_details;
CREATE TRIGGER update_business_details_updated_at BEFORE UPDATE ON business_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for better performance
DROP INDEX IF EXISTS idx_business_details_user_id;
CREATE INDEX idx_business_details_user_id ON business_details(user_id);

-- Add business_details to realtime
BEGIN;
    ALTER PUBLICATION supabase_realtime ADD TABLE business_details;
COMMIT;

-- Success message
SELECT 'Database schema created successfully! Business details table added.' as status;
