-- ========================================================
-- NETCAD Database Migration: Add Real Views & Likes
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/tucvqsutvgwenpzyzdrc/sql
-- ========================================================

-- 1. Add views and likes columns to articles table
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS views integer DEFAULT 0;
ALTER TABLE public.articles ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0;

-- 2. Make sure existing articles start with 0 instead of NULL
UPDATE public.articles SET views = 0 WHERE views IS NULL;
UPDATE public.articles SET likes = 0 WHERE likes IS NULL;

-- 3. Stored Procedure: Increment Real Views (safe for public visitors)
CREATE OR REPLACE FUNCTION public.increment_article_views(article_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_views integer;
BEGIN
  UPDATE public.articles
  SET views = COALESCE(views, 0) + 1
  WHERE id = article_id
  RETURNING views INTO new_views;
  
  RETURN COALESCE(new_views, 0);
END;
$$;

-- 4. Stored Procedure: Increment/Decrement Real Likes
CREATE OR REPLACE FUNCTION public.toggle_article_like(article_id uuid, delta integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_likes integer;
BEGIN
  UPDATE public.articles
  SET likes = GREATEST(0, COALESCE(likes, 0) + delta)
  WHERE id = article_id
  RETURNING likes INTO new_likes;
  
  RETURN COALESCE(new_likes, 0);
END;
$$;

-- 5. Grant execute permissions to public/anon users
GRANT EXECUTE ON FUNCTION public.increment_article_views(uuid) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.toggle_article_like(uuid, integer) TO anon, authenticated, service_role;
