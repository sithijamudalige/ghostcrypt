-- Allow anonymous users (like your hardcoded admin panel) to upload images to the bucket
CREATE POLICY "Allow admin to upload images" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'article_images' );
