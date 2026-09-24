-- 1. Create a new public bucket named 'labs' for .pkt and .ipynb files
insert into storage.buckets (id, name, public)
values ('labs', 'labs', true);

-- 2. Allow everyone to download the labs
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'labs' );

-- 3. Allow your admin panel to upload labs
create policy "Allow admin to upload labs"
on storage.objects for insert
with check ( bucket_id = 'labs' );
