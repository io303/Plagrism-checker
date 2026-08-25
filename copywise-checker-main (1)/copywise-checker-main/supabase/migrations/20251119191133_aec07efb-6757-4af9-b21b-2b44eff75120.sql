-- Create storage bucket for document uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  20971520, -- 20MB limit
  ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain']
);

-- Create check_history table to store plagiarism check results
CREATE TABLE public.check_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  original_text TEXT NOT NULL,
  plagiarism_percentage DECIMAL(5,2) NOT NULL,
  matches JSONB,
  is_original BOOLEAN NOT NULL DEFAULT false,
  document_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_check_history_created_at ON public.check_history(created_at DESC);
CREATE INDEX idx_check_history_user_id ON public.check_history(user_id);

-- Enable Row Level Security
ALTER TABLE public.check_history ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since no auth is implemented)
CREATE POLICY "Allow public read access to check history"
ON public.check_history
FOR SELECT
USING (true);

CREATE POLICY "Allow public insert to check history"
ON public.check_history
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow public delete own history"
ON public.check_history
FOR DELETE
USING (true);

-- Storage policies for documents bucket
CREATE POLICY "Allow public to upload documents"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow public to read documents"
ON storage.objects
FOR SELECT
USING (bucket_id = 'documents');

CREATE POLICY "Allow public to delete documents"
ON storage.objects
FOR DELETE
USING (bucket_id = 'documents');