
drop policy "Public submits inquiry" on public.inquiries;
create policy "Public submits inquiry" on public.inquiries
  for insert
  with check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 200
    and char_length(message) between 1 and 5000
  );
