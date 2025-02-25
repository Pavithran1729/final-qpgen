-- Drop existing foreign key constraint if it exists
ALTER TABLE IF EXISTS public.questions
DROP CONSTRAINT IF EXISTS questions_subject_id_fkey;

-- Add foreign key constraint with ON DELETE CASCADE
ALTER TABLE public.questions
ADD CONSTRAINT questions_subject_id_fkey
FOREIGN KEY (subject_id)
REFERENCES public.subjects(id)
ON DELETE CASCADE;

-- Update RLS policies
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for authenticated users"
ON public.subjects FOR SELECT
USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users"
ON public.subjects FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable update for user's own subjects"
ON public.subjects FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Enable delete for user's own subjects"
ON public.subjects FOR DELETE
USING (auth.uid() = user_id);