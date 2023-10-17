create table if not exists user_calendars(
    user_id integer references users (id) not null,
    cal_id integer references calendars (id) not null,
    created_at timestamp default now(),
    primary key (user_id, cal_id)
);