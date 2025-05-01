-- Create designs table
CREATE TABLE IF NOT EXISTS public.designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  design_data JSONB DEFAULT NULL,
  preview_url TEXT DEFAULT NULL,
  initial_model_image_url TEXT DEFAULT NULL,
  final_user_image_url TEXT DEFAULT NULL,
  user_style_metadata JSONB DEFAULT '{}'::jsonb,
  name TEXT DEFAULT 'Untitled Design',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add this table to the public schema
ALTER TABLE public.designs OWNER TO postgres;

-- Comment on the table and columns for clarity
COMMENT ON TABLE public.designs IS 'Stores user-created t-shirt designs';
COMMENT ON COLUMN public.designs.id IS 'Primary unique identifier for the design';
COMMENT ON COLUMN public.designs.user_id IS 'Foreign key to auth.users table';
COMMENT ON COLUMN public.designs.question_responses IS 'JSON containing responses to design questionnaire';
COMMENT ON COLUMN public.designs.design_data IS 'JSON containing design canvas data (fabric.js)';
COMMENT ON COLUMN public.designs.preview_url IS 'URL to the design preview image';
COMMENT ON COLUMN public.designs.initial_model_image_url IS 'URL to the initial AI-generated design';
COMMENT ON COLUMN public.designs.final_user_image_url IS 'URL to the final user-modified design';
COMMENT ON COLUMN public.designs.user_style_metadata IS 'JSON with user preferences and t-shirt options';