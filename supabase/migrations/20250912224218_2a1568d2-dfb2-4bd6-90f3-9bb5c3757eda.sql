-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create countries table
CREATE TABLE public.countries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create states table
CREATE TABLE public.states (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  country_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(name, country_id)
);

-- Add category_id, country_id, state_id to posts table
ALTER TABLE public.posts 
ADD COLUMN category_id UUID,
ADD COLUMN country_id UUID,
ADD COLUMN state_id UUID,
ADD COLUMN content TEXT,
ADD COLUMN tags TEXT[];

-- Enable RLS on new tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.states ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- Create policies for countries
CREATE POLICY "Countries are viewable by everyone" 
ON public.countries 
FOR SELECT 
USING (true);

-- Create policies for states
CREATE POLICY "States are viewable by everyone" 
ON public.states 
FOR SELECT 
USING (true);

-- Insert default categories
INSERT INTO public.categories (name, slug, description) VALUES
('Business', 'business', 'Business news and updates'),
('Finance', 'finance', 'Financial news and market updates'),
('Bollywood', 'bollywood', 'Bollywood news and entertainment'),
('Social', 'social', 'Social issues and community news'),
('Entertainment', 'entertainment', 'Entertainment and celebrity news'),
('Healthcare', 'healthcare', 'Health and medical news'),
('Sports', 'sports', 'Sports news and updates'),
('Education', 'education', 'Education news and developments'),
('Astrology', 'astrology', 'Astrology and spiritual content'),
('Politics', 'politics', 'Political news and analysis'),
('Beauty', 'beauty', 'Beauty and lifestyle content'),
('Travel', 'travel', 'Travel news and guides'),
('Movie Review', 'movie-review', 'Movie reviews and entertainment'),
('Election', 'election', 'Election news and coverage'),
('Stock Market', 'stock-market', 'Stock market and trading news'),
('IT Sector', 'it-sector', 'Technology and IT industry news');

-- Insert India as default country
INSERT INTO public.countries (name, code) VALUES ('India', 'IN');

-- Insert major Indian states
INSERT INTO public.states (name, code, country_id) 
SELECT state_name, state_code, c.id 
FROM (VALUES 
  ('Andhra Pradesh', 'AP'),
  ('Arunachal Pradesh', 'AR'),
  ('Assam', 'AS'),
  ('Bihar', 'BR'),
  ('Chhattisgarh', 'CG'),
  ('Goa', 'GA'),
  ('Gujarat', 'GJ'),
  ('Haryana', 'HR'),
  ('Himachal Pradesh', 'HP'),
  ('Jharkhand', 'JH'),
  ('Karnataka', 'KA'),
  ('Kerala', 'KL'),
  ('Madhya Pradesh', 'MP'),
  ('Maharashtra', 'MH'),
  ('Manipur', 'MN'),
  ('Meghalaya', 'ML'),
  ('Mizoram', 'MZ'),
  ('Nagaland', 'NL'),
  ('Odisha', 'OR'),
  ('Punjab', 'PB'),
  ('Rajasthan', 'RJ'),
  ('Sikkim', 'SK'),
  ('Tamil Nadu', 'TN'),
  ('Telangana', 'TG'),
  ('Tripura', 'TR'),
  ('Uttar Pradesh', 'UP'),
  ('Uttarakhand', 'UK'),
  ('West Bengal', 'WB'),
  ('Delhi', 'DL'),
  ('Jammu and Kashmir', 'JK'),
  ('Ladakh', 'LA'),
  ('Lakshadweep', 'LD'),
  ('Puducherry', 'PY')
) AS states(state_name, state_code)
CROSS JOIN public.countries c 
WHERE c.code = 'IN';

-- Create function to categorize news automatically
CREATE OR REPLACE FUNCTION public.auto_categorize_post(post_title text, post_description text)
RETURNS UUID
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  category_id UUID;
  title_lower text := lower(post_title);
  desc_lower text := lower(coalesce(post_description, ''));
BEGIN
  -- Business keywords
  IF title_lower ~ '(business|company|corporate|startup|entrepreneur|economy|trade|commerce|industry)' OR
     desc_lower ~ '(business|company|corporate|startup|entrepreneur|economy|trade|commerce|industry)' THEN
    SELECT id INTO category_id FROM categories WHERE slug = 'business';
    RETURN category_id;
  END IF;

  -- Finance keywords
  IF title_lower ~ '(finance|bank|money|investment|loan|credit|financial|rupee|dollar|market|trading|stock)' OR
     desc_lower ~ '(finance|bank|money|investment|loan|credit|financial|rupee|dollar|market|trading|stock)' THEN
    SELECT id INTO category_id FROM categories WHERE slug = 'finance';
    RETURN category_id;
  END IF;

  -- Politics keywords
  IF title_lower ~ '(politics|government|minister|parliament|election|vote|campaign|party|bjp|congress|aap)' OR
     desc_lower ~ '(politics|government|minister|parliament|election|vote|campaign|party|bjp|congress|aap)' THEN
    SELECT id INTO category_id FROM categories WHERE slug = 'politics';
    RETURN category_id;
  END IF;

  -- Sports keywords
  IF title_lower ~ '(cricket|football|tennis|hockey|olympics|sports|match|tournament|ipl|champion)' OR
     desc_lower ~ '(cricket|football|tennis|hockey|olympics|sports|match|tournament|ipl|champion)' THEN
    SELECT id INTO category_id FROM categories WHERE slug = 'sports';
    RETURN category_id;
  END IF;

  -- Bollywood keywords
  IF title_lower ~ '(bollywood|actor|actress|film|movie|cinema|entertainment|celebrity|star)' OR
     desc_lower ~ '(bollywood|actor|actress|film|movie|cinema|entertainment|celebrity|star)' THEN
    SELECT id INTO category_id FROM categories WHERE slug = 'bollywood';
    RETURN category_id;
  END IF;

  -- Healthcare keywords
  IF title_lower ~ '(health|medical|doctor|hospital|disease|medicine|covid|vaccine|treatment)' OR
     desc_lower ~ '(health|medical|doctor|hospital|disease|medicine|covid|vaccine|treatment)' THEN
    SELECT id INTO category_id FROM categories WHERE slug = 'healthcare';
    RETURN category_id;
  END IF;

  -- Technology keywords
  IF title_lower ~ '(technology|tech|software|app|digital|internet|ai|artificial intelligence|it)' OR
     desc_lower ~ '(technology|tech|software|app|digital|internet|ai|artificial intelligence|it)' THEN
    SELECT id INTO category_id FROM categories WHERE slug = 'it-sector';
    RETURN category_id;
  END IF;

  -- Default to general category
  SELECT id INTO category_id FROM categories WHERE slug = 'social';
  RETURN category_id;
END;
$$;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for posts table
ALTER TABLE public.posts REPLICA IDENTITY FULL;

-- Set up publication for realtime
-- Note: This is handled automatically by Supabase's realtime setup