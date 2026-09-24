-- 1. Remove the rule that requires every article to have a registered Google user attached to it
ALTER TABLE public.articles ALTER COLUMN author_id DROP NOT NULL;

-- 2. Allow the database to accept articles from the hardcoded /admin panel
CREATE POLICY "Allow hardcoded admin inserts" ON public.articles FOR INSERT WITH CHECK (true);
