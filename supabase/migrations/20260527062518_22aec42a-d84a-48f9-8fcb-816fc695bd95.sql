
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('media-videos', 'media-videos', true, 524288000, array['video/mp4','video/webm','video/quicktime','video/x-matroska']),
  ('media-images', 'media-images', true, 26214400, array['image/jpeg','image/png','image/webp','image/gif','image/avif'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "Public read media-videos"
  on storage.objects for select
  using (bucket_id = 'media-videos');

create policy "Admins upload media-videos"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media-videos' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update media-videos"
  on storage.objects for update to authenticated
  using (bucket_id = 'media-videos' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete media-videos"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media-videos' and public.has_role(auth.uid(), 'admin'));

create policy "Public read media-images"
  on storage.objects for select
  using (bucket_id = 'media-images');

create policy "Admins upload media-images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'media-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins update media-images"
  on storage.objects for update to authenticated
  using (bucket_id = 'media-images' and public.has_role(auth.uid(), 'admin'));

create policy "Admins delete media-images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'media-images' and public.has_role(auth.uid(), 'admin'));
