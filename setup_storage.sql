-- 1. Create a new public bucket named 'article_images'
insert into storage.buckets (id, name, public)
values ('article_images', 'article_images', true);

-- 2. Allow absolutely anyone on the internet to view the images
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'article_images' );

-- 3. Allow logged-in users (like you) to upload images to the bucket
create policy "Authenticated Users can upload images"
on storage.objects for insert
with check ( bucket_id = 'article_images' and auth.role() = 'authenticated' );
