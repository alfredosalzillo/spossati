create extension if not exists moddatetime schema extensions;

create type YDN as enum ('Y', 'D', 'N');
create type REVIEW_STATUS as enum('pending', 'valid', 'rejected');

drop table public.reviews;
create table public.reviews
(
    id                           uuid      default gen_random_uuid() not null primary key,
    user_id                      uuid      default auth.uid()        not null,
    place_id                     varchar(255)                        not null,
    card_payment_accepted        YDN                                 null,
    contactless_payment_accepted YDN                                 null,
    reason                       text                                null,
    created_at                   timestamp default now()
);

create policy "all can read all review" on public.reviews for all using (true) with check (true);

create
    policy "individuals can create their own reviews" on public.reviews for
    insert with check (auth.uid() = user_id);

create
    policy "individuals can update their own reviews" on public.reviews for
    update using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create
    policy "individuals can delete their own reviews" on public.reviews for
    delete using (auth.uid() = user_id);

drop materialized view reviews_summary;
create materialized view reviews_summary as
select place_id,
       count(*) as total_reviews,
       sum(CASE WHEN card_payment_accepted = 'Y' THEN 1 ELSE 0 END) / count(*) as p_card_payment_accepted,
       sum(CASE WHEN contactless_payment_accepted = 'Y' THEN 1 ELSE 0 END) / count(*) as p_contactless_payment_accepted
from public.reviews
group by place_id;
refresh materialized view reviews_summary;
select * from reviews_summary;
