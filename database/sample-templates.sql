-- Sample Templates for Different Business Types
-- Run this in Supabase SQL Editor to add templates

-- COACHING / EDUCATION Templates
INSERT INTO templates (name, category, business_type, bg_color, text_color, elements) VALUES
('Coaching Success Banner', 'youtube-banner', 'coaching', '#1e3a8a', '#ffffff', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 48, "fontWeight": "800", "fontFamily": "Montserrat", "textColor": "#ffffff", "x": 400, "y": 200, "width": 600, "height": 60, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 24, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#bfdbfe", "x": 400, "y": 280, "width": 600, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "Call: {{PHONE}}", "fontSize": 18, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#fbbf24", "x": 400, "y": 350, "width": 300, "height": 30, "placeholder": "phone"},
    {"type": "shape", "shapeType": "rect", "x": 50, "y": 50, "width": 200, "height": 400, "fillColor": "#3b82f6", "opacity": 0.3}
]'::jsonb),

('Coaching Achievement Post', 'instagram-square', 'coaching', '#f0f9ff', '#1e3a8a', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 36, "fontWeight": "700", "fontFamily": "Montserrat", "textColor": "#1e40af", "x": 400, "y": 150, "width": 500, "height": 50, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 20, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#3b82f6", "x": 400, "y": 220, "width": 500, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "{{WEBSITE}}", "fontSize": 16, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#64748b", "x": 400, "y": 350, "width": 400, "height": 30, "placeholder": "website"}
]'::jsonb);

-- CLOTHING / FASHION Templates
INSERT INTO templates (name, category, business_type, bg_color, text_color, elements) VALUES
('Fashion Brand Banner', 'youtube-banner', 'clothing', '#fce7f3', '#831843', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 52, "fontWeight": "800", "fontFamily": "Playfair Display", "textColor": "#831843", "x": 400, "y": 180, "width": 600, "height": 70, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 28, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#be185d", "x": 400, "y": 270, "width": 600, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "Visit: {{WEBSITE}}", "fontSize": 18, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#9d174d", "x": 400, "y": 340, "width": 400, "height": 30, "placeholder": "website"},
    {"type": "shape", "shapeType": "circle", "x": 100, "y": 150, "width": 120, "height": 120, "fillColor": "#f472b6", "opacity": 0.4}
]'::jsonb),

('Fashion Sale Post', 'instagram-square', 'clothing', '#fef3c7', '#92400e', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 40, "fontWeight": "700", "fontFamily": "Playfair Display", "textColor": "#92400e", "x": 400, "y": 200, "width": 500, "height": 60, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 24, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#b45309", "x": 400, "y": 280, "width": 500, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "Contact: {{PHONE}}", "fontSize": 18, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#78350f", "x": 400, "y": 360, "width": 300, "height": 30, "placeholder": "phone"},
    {"type": "shape", "shapeType": "rect", "x": 600, "y": 100, "width": 150, "height": 150, "fillColor": "#fbbf24", "opacity": 0.5}
]'::jsonb),

('Clothing Brand Story', 'instagram-story', 'clothing', '#ffffff', '#1f2937', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 42, "fontWeight": "700", "fontFamily": "Montserrat", "textColor": "#1f2937", "x": 300, "y": 300, "width": 500, "height": 60, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 22, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#4b5563", "x": 300, "y": 380, "width": 500, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "{{WEBSITE}}", "fontSize": 16, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#7c3aed", "x": 300, "y": 450, "width": 400, "height": 30, "placeholder": "website"}
]'::jsonb);

-- RESTAURANT / FOOD Templates
INSERT INTO templates (name, category, business_type, bg_color, text_color, elements) VALUES
('Restaurant Banner', 'youtube-banner', 'restaurant', '#7c2d12', '#fffbeb', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 50, "fontWeight": "800", "fontFamily": "Playfair Display", "textColor": "#fffbeb", "x": 400, "y": 190, "width": 600, "height": 70, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 26, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#fed7aa", "x": 400, "y": 280, "width": 600, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "Order: {{PHONE}}", "fontSize": 20, "fontWeight": "700", "fontFamily": "Inter", "textColor": "#fbbf24", "x": 400, "y": 350, "width": 300, "height": 35, "placeholder": "phone"},
    {"type": "shape", "shapeType": "rect", "x": 50, "y": 50, "width": 150, "height": 150, "fillColor": "#f97316", "opacity": 0.3}
]'::jsonb),

('Food Delivery Post', 'instagram-square', 'restaurant', '#fef3c7', '#92400e', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 38, "fontWeight": "700", "fontFamily": "Montserrat", "textColor": "#92400e", "x": 400, "y": 180, "width": 500, "height": 60, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 22, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#b45309", "x": 400, "y": 260, "width": 500, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "{{ADDRESS}}", "fontSize": 16, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#78350f", "x": 400, "y": 350, "width": 450, "height": 40, "placeholder": "address"}
]'::jsonb);

-- SCHOOL / EDUCATION Templates
INSERT INTO templates (name, category, business_type, bg_color, text_color, elements) VALUES
('School Banner', 'youtube-banner', 'school', '#ecfdf5', '#064e3b', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 48, "fontWeight": "800", "fontFamily": "Montserrat", "textColor": "#064e3b", "x": 400, "y": 200, "width": 600, "height": 70, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 24, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#059669", "x": 400, "y": 290, "width": 600, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "Contact: {{PHONE}} | {{EMAIL}}", "fontSize": 18, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#047857", "x": 400, "y": 360, "width": 600, "height": 30, "placeholder": "contact"},
    {"type": "shape", "shapeType": "circle", "x": 700, "y": 100, "width": 100, "height": 100, "fillColor": "#10b981", "opacity": 0.2}
]'::jsonb),

('Education Institute Post', 'facebook', 'school', '#eff6ff', '#1e40af', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 40, "fontWeight": "700", "fontFamily": "Montserrat", "textColor": "#1e40af", "x": 400, "y": 180, "width": 500, "height": 60, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 22, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#3b82f6", "x": 400, "y": 260, "width": 500, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "{{WEBSITE}}", "fontSize": 16, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#60a5fa", "x": 400, "y": 340, "width": 400, "height": 30, "placeholder": "website"}
]'::jsonb);

-- GENERAL / ALL Business Types
INSERT INTO templates (name, category, business_type, bg_color, text_color, elements) VALUES
('Business Professional Banner', 'youtube-banner', 'all', '#f8fafc', '#0f172a', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 46, "fontWeight": "800", "fontFamily": "Montserrat", "textColor": "#0f172a", "x": 400, "y": 200, "width": 600, "height": 70, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 24, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#475569", "x": 400, "y": 290, "width": 600, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "{{PHONE}} | {{EMAIL}}", "fontSize": 16, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#64748b", "x": 400, "y": 360, "width": 500, "height": 30, "placeholder": "contact"}
]'::jsonb),

('Social Media Post', 'instagram-square', 'all', '#ffffff', '#1e293b', '[
    {"type": "text", "text": "{{BUSINESS_NAME}}", "fontSize": 36, "fontWeight": "700", "fontFamily": "Montserrat", "textColor": "#1e293b", "x": 400, "y": 200, "width": 500, "height": 60, "placeholder": "business_name"},
    {"type": "text", "text": "{{TAGLINE}}", "fontSize": 20, "fontWeight": "500", "fontFamily": "Inter", "textColor": "#475569", "x": 400, "y": 280, "width": 500, "height": 40, "placeholder": "tagline"},
    {"type": "text", "text": "{{WEBSITE}}", "fontSize": 14, "fontWeight": "600", "fontFamily": "Inter", "textColor": "#7c3aed", "x": 400, "y": 360, "width": 400, "height": 30, "placeholder": "website"}
]'::jsonb);

SELECT 'Sample templates inserted successfully!' as status;
