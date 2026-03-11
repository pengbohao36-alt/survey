-- CREATE TABLES

-- Surveys Table
CREATE TABLE IF NOT EXISTS public.surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('text', 'choice', 'rating')),
  options JSONB, -- Array of strings for choices
  "order" INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Responses Table
CREATE TABLE IF NOT EXISTS public.responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
  answers_jsonb JSONB NOT NULL, -- Flexible structure to store question_id -> answer mapping
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- INSERT DEMO DATA
INSERT INTO public.surveys (id, title, description)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'Customer Feedback', 'Help us improve our service by answering a few quick questions.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.questions (survey_id, question_text, type, options, "order")
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'How would you rate your overall experience?', 'rating', NULL, 1),
  ('11111111-1111-1111-1111-111111111111', 'Which feature do you use the most?', 'choice', '["Analytics", "Dashboard", "Reporting", "Settings"]'::jsonb, 2),
  ('11111111-1111-1111-1111-111111111111', 'Any additional feedback?', 'text', NULL, 3);
