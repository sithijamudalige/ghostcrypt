-- 1. Add status column for the approval system (defaults to pending for users)
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS status text DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected'));

-- 2. Make sure any old articles you already wrote are automatically published
UPDATE public.articles SET status = 'published' WHERE status = 'pending';

-- 3. Give the Admin Panel permission to Update and Delete articles without needing Google Login
CREATE POLICY "Allow hardcoded admin updates" ON public.articles FOR UPDATE USING (true);
CREATE POLICY "Allow hardcoded admin deletes" ON public.articles FOR DELETE USING (true);
