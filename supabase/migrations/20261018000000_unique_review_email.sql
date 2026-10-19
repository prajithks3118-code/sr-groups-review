create unique index if not exists reviews_email_unique_idx
on public.reviews (lower(btrim(email)));